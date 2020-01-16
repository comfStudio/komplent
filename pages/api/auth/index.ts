import compose from 'micro-compose'
import { NOT_FOUND, FORBIDDEN } from 'http-status-codes'
import qs from 'qs'
import CONFIG from '@server/config'


import microAuthFacebook from 'microauth-facebook'
import microAuthGoogle from '@server/external/microauth_google'
import microAuthTwitter from '@server/external/microauth_twitter'
import log from '@utility/log'
import { User } from '@db/models'
import * as pages from '@utility/pages'
import { MsgPageType } from '@server/constants'
import { create_user, validize_username, login_user, login_user_without_password } from '@services/user'
import { create_file } from '@services/general'
import { ExApiRequest, with_middleware, ExApiResponse } from '@server/middleware'

const get_oauth_urls = (app: string) => ({
    // Alternatively, use `[app].ts` filenames for paramaterized urls
    callbackUrl: `${CONFIG.URL}/api/auth/${app}/callback`,
    path: `/api/auth/${app}`
  })

const twitterOptions = {
    consumerKey: CONFIG.TWITTER_CONSUMER_KEY,
    consumerSecret: CONFIG.TWITTER_CONSUMER_SECRET,
    ...get_oauth_urls('twitter'),
}

const facebookOptions = {
    appId: CONFIG.FACEBOOK_APP_ID,
    appSecret: CONFIG.FACEBOOK_APP_SECRET,
    ...get_oauth_urls('facebook'),
    fields: 'id,name,email,picture,first_name,short_name', // Check fields list here: https://developers.facebook.com/docs/graph-api/reference/v2.11/user
    scope: 'public_profile,email'	// Check permissions list here: https://developers.facebook.com/docs/facebook-login/permissions
}

const googleOptions = {
    clientId: CONFIG.GOOGLE_CLIENT_ID,
    clientSecret: CONFIG.GOOGLE_CLIENT_SECRET,
    ...get_oauth_urls('google'),
    scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ],
    personFields: 'emailAddresses,names,photos',
}

const facebookAuth = microAuthFacebook(facebookOptions)
const googleAuth = microAuthGoogle(googleOptions)
const twitterAuth = microAuthTwitter(twitterOptions)

const handler = async (o_req, o_res, auth) => with_middleware(async (req: ExApiRequest, res: ExApiResponse) => {

    if (!auth) {
        return res.redirect(302, pages.message + '?' + qs.stringify({type: MsgPageType.LoginNotFound}))
    }

    if (auth.err) {
        log.error(auth.err)
        return res.redirect(302, pages.message + '?' + qs.stringify({type: MsgPageType.Forbidden}))
    }

    let key
    let oauth_id
    let username
    let email
    let name
    let image_url
    let cover_url
    let email_verified = true
    let description
    let socials = []

    if (auth.result.provider === 'google') {
        key = 'oauth_google_id'
        oauth_id = auth.result.info.resourceName
        username = auth.result.info?.names?.[0]?.givenName
        name = auth.result.info?.names?.[0]?.givenName
        email = auth.result.info?.emailAddresses?.[0]?.value
        image_url = auth.result.info?.photos?.[0]?.url
    } else if (auth.result.provider === 'facebook') {
        key= 'oauth_facebook_id'
        oauth_id = auth.result.info.id
        username = auth.result.info.short_name
        name = auth.result.info.name
        email = auth.result.info.email
        image_url = auth.result.info?.picture?.data?.url
    } else if (auth.result.provider === 'twitter') {
        key= 'oauth_twitter_id'
        oauth_id = auth.result.info.id_str
        username = auth.result.info?.screen_name
        name = auth.result.info?.name ?? auth.result.info?.screen_name
        if (auth.result.info.description) {
            description = auth.result.info.description
        }
        if (auth.result.info.email) {
            email = auth.result.info.email
        } else {
            email_verified = null
        }
        if (auth.result.info.profile_use_background_image) {
            cover_url = auth.result.info?.profile_image_url_https
        }
        if (!auth.result.info.default_profile_image) {
            image_url = auth.result.info?.profile_image_url_https
        }
        socials.push({ url: `https://twitter.com/${username}`, name: `@${username}` })
    }
    
    const oauth_key: any = {}
    oauth_key[key] = oauth_id

    let user =  await User.findOne(oauth_key)
    const existing = !!user

    if (req.user && existing) {
        return res.redirect(302, pages.message + '?' + qs.stringify({type: MsgPageType.OAuthAlreadyLinked}))
    } else if (req.user) {
        user = await User.findById(req.user._id)
    }

    if (username) {
        username = validize_username(username)
    }

    if (!user) {
        if (email && (await User.findOne({email: email.toLowerCase()}).countDocuments())) {
            return res.redirect(302, pages.message + '?' + qs.stringify({type: MsgPageType.LoginDuplicateEmail}))
        }
        user = await create_user({username, email, name, email_verified}, { save: false, randomize_username: true, unverify_email: false })
        if (description) {
            if (!user.profile_body) {
                user.profile_body = description
            }
        }
        if (image_url && !user.avatar) {
            user.avatar = await create_file('Image', user, image_url)
            if (!user.avatar.paths) {
                user.avatar.paths = []
            }
            user.avatar.paths.push({url: image_url, key: image_url})
            await user.avatar.save()
        }
        if (cover_url && !user.profile_cover) {
            user.profile_cover = await create_file('Image', user, cover_url)
            if (!user.profile_cover.paths) {
                user.profile_cover.paths = []
            }
            user.profile_cover.paths.push({url: image_url, key: image_url})
            await user.profile_cover.save()
        }
    }

    if (socials.length) {
        if (!user.socials) {
            user.socials = []
        }

        for (let s of socials) {
            if (!user.socials.map(v => v.url.toLowerCase()).includes(s.url.toLowerCase())) {
                user.socials = [...user.socials, s]
            }
        }

    }

    let datas = user.oauth_data ?? []
    user.oauth_data = [...datas.filter(v => v.provider != auth.result.provider), auth.result]

    user.set(oauth_key)

    await user.save()

    if (existing) {
        const token = await login_user_without_password(user, req, res)
        return res.redirect(302, pages.login + '?' + qs.stringify({token}))
    }

    if (req.user) {
        return res.redirect(302, pages.message + '?' + qs.stringify({type: MsgPageType.CloseWindow}))
    }

    return res.redirect(302, pages.finish_join + '?' + qs.stringify({user_id: user._id.toString(), token: auth.result.accessToken, provider: auth.result.provider}))
})(o_req, o_res)

export default compose(facebookAuth, googleAuth, twitterAuth)(handler)
