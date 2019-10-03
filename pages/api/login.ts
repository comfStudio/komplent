import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { BAD_REQUEST, OK } from 'http-status-codes'


import { with_middleware, ExApiRequest } from '@server/middleware'
import { error_message, message } from '@utility/message'
import { User } from '@db/models'
import { login_user } from '@server/db'

const cors = microCors({ allowMethods: ['POST', 'OPTIONS'] })

export default with_middleware(async (req: ExApiRequest, res: NextApiResponse) => {
    if (!req.user) {
        try {
            const { name, password } = req.json
            if (name && password) {
                let u = null
                if (name.includes('@')) {
                    u = await User.findOne({email:name}).select('+password').lean()
                }
                if (!u) {
                    u = await User.findOne({username:name}).select('+password').lean()
                }
                let token = null
                if (u) {
                    token = await login_user(u, password, req, res)
                }
                if (token) {
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
})