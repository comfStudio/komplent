import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { User } from '@db/models'
import { IUser } from '@schema/user'
import { cookie_session } from '@server/middleware'
import {
    JWT_KEY,
    JWT_EXPIRATION,
    CRYPTO_COST_FACTOR,
    STATES,
} from '@server/constants'
import { generate_random_id } from '@utility/misc'

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

export const create_user = async (data: IUser, { save = true, randomize_username = false } = {}) => {
    let u = new User()
    return await update_user_creds(u, data, {save, randomize_username})
}

export const update_user_creds = async (user, data: IUser, { save = true, randomize_username = false } = {}) => {

    if (data.password) {
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
        if (user.email && (user.email !== data.email.toLowerCase())) {
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

export const login_user = async (user: IUser, password, req, res) => {
    if (user) {
        let r = await bcrypt.compare(password, user.password)
        if (r) {
            return login_user_without_password(user, req, res)
        }
    }
    return null
}

export const login_user_without_password = async (user: IUser, req, res) => {
    if (user && req && res) {
        const token = jwt.sign(
            { username: user.username, user_id: user._id },
            JWT_KEY,
            {
                algorithm: 'HS256',
                expiresIn: JWT_EXPIRATION,
            }
        )
        return token
    }
    return null
}

export const logout_user = async (req, res) => {
    if (req && res) {
        cookie_session(req, res)
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