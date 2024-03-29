import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

import { User } from '@db/models'
import { IUser } from '@schema/user'
import { cookie_session, get_jwt_data } from '@server/middleware'
import {
    JWT_KEY,
    JWT_EXPIRATION,
    CRYPTO_COST_FACTOR,
    STATES,
    TASK,
    JWTData,
} from '@server/constants'
import { generate_random_id, user_among, validate_password, validate_username } from '@utility/misc'
import fairy from '@server/fairy'
import { schedule_unique, schedule_unique_now } from '@server/tasks'
import { psession_create, psession_update, psession_remove, psession_exists, psession_remove_by_user } from '@services/psession'
import { jwt_sign } from '@server/misc'

export async function connect(MONGODB_URL) {
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

export const create_user = async (data: IUser, { save = true, randomize_username = false, unverify_email = true, creator = false } = {}) => {
    let u = new User()
    u = await update_user_creds(u, data, {save, randomize_username, unverify_email})

    return u
}

export const update_user = async (user, data: any, { save = true, document = undefined }) => {
    let obj = document ?? User.findById(data._id)
    user_among(user._id, obj._id)

    if (data.type && !["creator", "consumer"].includes(data.type)) {
        throw Error("Invalid user type")
    }

    obj.set(data)

    if (save) {
        await obj.save()
    }

    return obj
}

export const update_user_type = async () => {

}

export const update_user_creds = async (user, data: IUser, { save = true, randomize_username = false, require_old_password = false, unverify_email = true } = {}) => {

    let _data = {...data}

    if (_data.password) {
        if (require_old_password) {
            if (user.password && !await check_user_password(user, _data.old_password || "")) {
                throw Error("Old password does not match")
            }
        }

        if (!validate_password(_data.password)) {
            throw Error("Password validation failed")
        }

        // eslint-disable-next-line
        user.password = await bcrypt.hash(_data.password, CRYPTO_COST_FACTOR)
        // eslint-disable-next-line
        user.password_change_date = new Date()
        delete _data.password
        await psession_remove_by_user(user)
    }

    if (_data.username) {

        if (!validate_username(_data.username)) {
            throw Error("Username validation failed")
        }

        user.username = data.username
        if (randomize_username) {
            if (!user.username || (user.username && (await User.findOne({username:user.username}).countDocuments()))) {
                let prefix = user.username || ''
                // eslint-disable-next-line
                user.username = (prefix + generate_random_id(prefix ? 4 : 10)).toLowerCase()
            }
        }
        delete _data.username
    }

    if (_data.email) {
        if (user.email && (user.email !== _data.email.toLowerCase()) && unverify_email) {
            // eslint-disable-next-line
            user.email_verified = false
        }
        // eslint-disable-next-line
        user.email = _data.email
        delete _data.email
    }

    if (data.email_verified === null) {
        delete _data.email_verified
    }

    user.set(_data)

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
        const stoken = await psession_create(user, req.ip_address)
        const token = jwt_sign({
            username: user.username,
            user_id: user.id.toString(),
            password_change_date: user.password_change_date.getTime(),
            psession_token: stoken
        } as JWTData)
        await psession_update(stoken, {jwt_token: token})
        // eslint-disable-next-line
        req.session.jwt_token = token
        fairy().emit("user_logged_in", user)
        return token
    }
    return null
}

export const logout_user = async (req, res) => {
    if (req && res) {
        if (req.session?.jwt_token) {
            let token = get_jwt_data(req.session.jwt_token).psession_token
            if (token) {
                const r = await psession_remove(token)

            }
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

export function send_activate_email (user) {
    if (!user.email_verified) {
        schedule_unique_now({ key: user._id, task: TASK.activate_email, data: { user_id: user._id } })
        return true
    }
    return false
}

export const send_recover_email = user => {
    schedule_unique_now({ key: user._id, task: TASK.reset_login, data: { user_id: user._id } })
    return true
}

export const create_user_defaults = async () => {
    const default_users = [
        {
            name: 'staff',
            username: 'staff',
            visibility: 'hidden',
            type: 'staff',
            email: 'staff@komplent.com',
            password: 'staff@komplent.com',
        },
    ]

    for (let t of default_users) {
        await User.findOne({ username: t.username }).then(v => {
            if (!v) {
                let d = new User(t)
                d.save()
            }
        })
    }
}

export const configure_user_fairy_handlers = () => {
    
    fairy()?.on("user_joined", user => {
        send_activate_email(user)
    })
    
    fairy()?.on("user_email_changed", (user, email) => {
        send_activate_email(user)
    })

}