import compose from 'micro-compose'
import { NOT_FOUND, FORBIDDEN } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import redirect from 'micro-redirect'
import qs from 'qs'
import CONFIG from '@server/config'


import microAuthFacebook from 'microauth-facebook'
import microAuthTwitter from 'microauth-twitter'
import microAuthGoogle from '@server/external/microauth_google'
import log from '@utility/log'
import { User } from '@db/models'
import * as pages from '@utility/pages'
import { ErrorPageType } from '@server/constants'
import { create_user, validize_username, login_user, login_user_without_password } from '@services/user'
import { create_file } from '@services/general'

const twitterOptions = {
    clientId: 'client_id',
    clientSecret: 'client_secret',
    callbackUrl: 'http://localhost:3500/api/auth/twitter/callback',
    path: '/api/auth/twitter',
    scope: 'identity.basic,identity.team,identity.avatar',
}

const facebookOptions = {
    appId: CONFIG.FACEBOOK_APP_ID,
    appSecret: CONFIG.FACEBOOK_APP_SECRET,
    callbackUrl: 'http://localhost:3500/api/auth/facebook/callback',
    path: '/api/auth/facebook',
      fields: 'id,name,email,picture,first_name,short_name', // Check fields list here: https://developers.facebook.com/docs/graph-api/reference/v2.11/user
      scope: 'public_profile,email'	// Check permissions list here: https://developers.facebook.com/docs/facebook-login/permissions
}

const googleOptions = {
    clientId: CONFIG.GOOGLE_CLIENT_ID,
    clientSecret: CONFIG.GOOGLE_CLIENT_SECRET,
    callbackUrl: 'http://localhost:3500/api/auth/google/callback',
    path: '/api/auth/google',
    scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ],
    personFields: 'emailAddresses,names,photos',
}

const facebookAuth = microAuthFacebook(facebookOptions)
const googleAuth = microAuthGoogle(googleOptions)
const twitterAuth = microAuthTwitter(twitterOptions)

const handler = async (req: NextApiRequest, res: NextApiResponse, auth) => {

    if (!auth) {
        return redirect(res, 302, pages.error + '?' + qs.stringify({type: ErrorPageType.LoginNotFound}))
    }

    if (auth.err) {
        log.error(auth.err)
        return redirect(res, 302, pages.error + '?' + qs.stringify({type: ErrorPageType.Forbidden}))
    }

    let key
    let oauth_id
    let username
    let email
    let name
    let image_url

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
        console.log(auth)
        return
    }

    const oauth_key: any = {}
    oauth_key[key] = oauth_id

    if (username) {
        username = validize_username(username)
    }

    let user =  await User.findOne(oauth_key)
    const existing = !!user

    if (!user) {
        if (email && (await User.findOne({email: email.toLowerCase()}).countDocuments())) {
            return redirect(res, 302, pages.error + '?' + qs.stringify({type: ErrorPageType.LoginDuplicateEmail}))
        }
        user = await create_user({username, email, name, email_verified: true}, { save: false, randomize_username: true })
        user.set(oauth_key)
        if (image_url) {
            user.avatar = await create_file('Image', user, image_url)
            if (!user.avatar.paths) {
                user.avatar.paths = []
            }
            user.avatar.paths.push({url: image_url, key: image_url})
            await user.avatar.save()
        }
    }

    let datas = user.oauth_data ?? []
    user.oauth_data = [...datas.filter(v => v.provider != auth.result.provider), auth.result]

    await user.save()

    if (existing) {
        const token = await login_user_without_password(user, req, res)
        return redirect(res, 302, pages.login + '?' + qs.stringify({token}))
    }

    return redirect(res, 302, pages.finish_join + '?' + qs.stringify({user_id: user._id.toString(), token: auth.result.accessToken, provider: auth.result.provider}))
}

export default compose(facebookAuth, googleAuth, twitterAuth)(handler)
