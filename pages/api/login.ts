import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { BAD_REQUEST, OK } from 'http-status-codes'

import { with_user, ExApiRequest, with_json, with_cookie } from '@server/middleware'
import { error_message, message } from '@utility/message'
import { User } from '@db/models'
import { login_user } from '@server/db'
import { COOKIE_AUTH_TOKEN_KEY } from '@server/constants'

const cors = microCors({ allowMethods: ['POST'] })

export default cors(with_cookie(with_user(with_json(async (req: ExApiRequest, res: NextApiResponse) => {
    if (!req.user) {
        try {
            const { name, password } = req.json
            if (name && password) {
                let u = null
                if (name.includes('@')) {
                    u = await User.findOne({email:name}).lean()
                }
                if (!u) {
                    u = await User.findOne({username:name}).lean()
                }
                if (u && u.password === password) {
                    let token = await login_user(u, req, res)
                    res.status(OK).json(Object.assign(message("Logged in"), {token, user:u}))
                } else {
                res.status(BAD_REQUEST).json(error_message("User does not exists"))
                }
            } else {
                res.status(BAD_REQUEST).json(error_message("Missing user credentials"))
            }
        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }

    } else {
        res.status(OK).json(Object.assign(error_message("Already logged in"), {user:req.user}))
    }
}), false)))