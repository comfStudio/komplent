import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { BAD_REQUEST, OK } from 'http-status-codes'

import { with_middleware, ExApiRequest } from '@server/middleware'
import { error_message, message } from '@utility/message'
import { User } from '@db/models'
import { login_user } from '@services/user'

const cors = microCors({ allowMethods: ['POST', 'OPTIONS'] })

/**
 * 
 * @api {POST} /login Login user
 * @apiName login
 * @apiGroup Authentication
 * @apiVersion  0.1.0
 * 
 * @apiParam  {String} name Username or email
 * @apiParam  {String} password Password
 * 
 * @apiSuccess (200) {String} msg Logged in
 * @apiSuccess (200) {String} token JWT token
 * @apiSuccess (200) {String} user User object
 * 
 * @apiParamExample  {JSON} Request-Example:
 * {
 *     name : test@test.com
 *     password : password123
 * }
 * 
 * 
 * @apiSuccessExample {JSON} Success-Response:
 * {
 *     msg : "Logged in"
 *     token : "5465ih567n56l9g33450t0p54p8"
 *     user : {...}
 * }
 * 
 * 
 */
export default with_middleware(
    async (req: ExApiRequest, res: NextApiResponse) => {
        if (!req.user) {
            try {
                const { name, password } = req.json
                if (name && password) {
                    let u = null
                    if (name.includes('@')) {
                        u = await User.findOne({ email: name })
                            .select('+password')
                            .lean()
                    }
                    if (!u) {
                        u = await User.findOne({ username: name })
                            .select('+password')
                            .lean()
                    }
                    let token = null
                    if (u) {
                        token = await login_user(u, password, req, res)
                    }
                    if (token) {
                        res.status(OK).json(
                            Object.assign(message('Logged in'), {
                                token,
                                user: {...u, password: undefined},
                            })
                        )
                    } else {
                        res.status(BAD_REQUEST).json(
                            error_message('User does not exists')
                        )
                    }
                } else {
                    res.status(BAD_REQUEST).json(
                        error_message('Missing user credentials')
                    )
                }
            } catch (err) {
                global.log.error(err)
                res.status(BAD_REQUEST).json(error_message(err.message))
            }
        } else {
            res.status(OK).json(
                Object.assign(error_message('Already logged in'), {
                    user: req.user,
                })
            )
        }
    }
)
