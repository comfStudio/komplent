import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

import { User } from '@db/models'
import { IUser } from '@schema/user'
import { cookie_session } from '@server/middleware'
import {
    JWT_KEY,
    JWT_EXPIRATION,
    CRYPTO_COST_FACTOR,
    STATES,
    TASK,
} from '@server/constants'
import { generate_random_id } from '@utility/misc'
import fairy from '@server/fairy'
import { schedule_unique, schedule_unique_now } from '@server/tasks'
import { jwt_sign } from '@server/misc'

export async function connect(MONGODB_URL) {
    console.log(MONGODB_URL)
    if (MONGODB_URL) {
        if (mongoose.connection.readyState == 0) {
            await mongoose.connect(MONGODB_URL, {
                useNewUrlParser: true,
            })
            STATES.MONGODB_CONNECTED = true
        } else {
            STATES.MONGODB_CONNECTED = true
        }
    }
}

export const create_user = async (data: IUser, { save = true, randomize_username = false, unverify_email = true } = {}) => {
    let u = new User()
    return await update_user_creds(u, data, {save, randomize_username, unverify_email})
}

export const update_user_creds = async (user, data: IUser, { save = true, randomize_username = false, require_old_password = false, unverify_email = true } = {}) => {

    if (data.password) {
        if (require_old_password) {
            if (user.password && !await check_user_password(user, data.old_password || "")) {
                throw Error("Old password does not match")
            }
        }
        user.password = await bcrypt.hash(data.password, CRYPTO_COST_FACTOR)
        delete data.password
    }

    if (data.username) {
        user.username = data.username
        if (randomize_username) {
            if (!user.username || (user.username && (await User.findOne({username:user.username}).countDocuments()))) {
                let prefix = user.username || ''
                // eslint-disable-next-line
                user.username = (prefix + generate_random_id(prefix ? 4 : 10)).toLowerCase()
            }
        }
        delete data.username
    }

    if (data.email) {
        if (user.email && (user.email !== data.email.toLowerCase()) && unverify_email) {
            // eslint-disable-next-line
            user.email_verified = false
        }
        // eslint-disable-next-line
        user.email = data.email
        delete data.email
    }

    user.set(data)

    if (save) {
        await user.save()
    }

    return user
}

export const check_user_password = async(user: IUser, password) => {
    return await bcrypt.compare(password, user.password)
}

export const user_has_password = async (user_id) => {
    return !!(await User.findById(user_id).select("+password")).password
}

export const verify_user_email = async (user_id, old_email = undefined, only_if_unverified = false) => {
    const user = await User.findById(user_id).select("email email_verified")
    if (!user) {
        throw Error(`User ${user_id} not found`)
    }
    if (only_if_unverified && user.email_verified) {
        throw Error(`User ${user_id} already has a verified email`)
    }
    if (old_email && user.email !== old_email) {
        throw Error(`User old email mismatch during verification`)
    }
    user.email_verified = true
    await user.save()
    return true
}

export const login_user = async (user: IUser, password, req, res) => {
    if (user) {
        let r = await check_user_password(user, password)
        if (r) {
            return login_user_without_password(user, req, res)
        }
    }
    return null
}

export const login_user_without_password = async (user: IUser, req, res) => {
    if (user && req && res) {
        const token = jwt_sign({ username: user.username, user_id: user._id })
        req.session.jwt_token = token
        fairy().emit("user_logged_in", user)
        return token
    }
    return null
}

export const logout_user = async (req, res) => {
    if (req && res) {
        if (!req.session) {
            cookie_session(req, res)
        }
        if (req.user) {
            fairy().emit("user_logged_out", req.user)
        }
        req.session = null
    }
}

export const validize_username = (name) => {
    name = name.trim()
    name = name.split(' ').join('_')
    name = name.replace(/[^a-zA-Z0-9]/g, '_')
    if (name.length > 60) {
        name = name.substring(0, 60)
    }
    return name.toLowerCase()
}

export const unlink_provider = async (user_id, provider) => {

    let key

    if (provider === 'google') {
        key = 'oauth_google_id'
    } else if (provider === 'facebook') {
        key = 'oauth_facebook_id'
    } else if (provider === 'twitter') {
        key = 'oauth_twitter_id'
    } else {
        throw Error("No valid provider provided")
    }

    const user = await User.findById(user_id).select(`+password ${key} oauth_data`)

    if (!user) {
        throw Error("Invalid user")
    }

    let datas = user.oauth_data ?? []

    if (!!!user.password && datas.length <= 1) {
        throw Error("A password has not been set on this user")
    }

    user[key] = undefined

    user.oauth_data = [...datas.filter(v => v.provider != provider)]

    await user.save()

    return true
}

export const configure_fairy_handlers = () => {
    
    fairy()?.on("user_joined", user => {
        if (!user.email_verified) {
            schedule_unique_now({ key: user._id, task: TASK.activate_email, data: { user_id: user._id } })
        }
    })
    
    fairy()?.on("user_email_changed", (user, email) => {
        if (!user.email_verified) {
            schedule_unique_now({ key: user._id, task: TASK.activate_email, data: { user_id: user._id } })
        }
    })

}

if (global?.store && !global?.store?.user_fairy_handlers) {
    configure_fairy_handlers()
    global.store.user_fairy_handlers = true
}