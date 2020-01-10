import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { BAD_REQUEST, OK } from 'http-status-codes'

import { with_middleware, ExApiRequest } from '@server/middleware'
import { error_message, message, data_message } from '@utility/message'
import { User } from '@db/models'
import { send_recover_email, update_user_creds } from '@services/user'
import { jwt_verify } from '@server/misc'

const cors = microCors({ allowMethods: ['PUT', 'POST', 'OPTIONS'] })

export default with_middleware(
    async (req: ExApiRequest, res: NextApiResponse) => {
        if (!req.user) {
            try {
                if (req.method === 'post') {
                    
                    const { token, password } = req.json

                    if (token && password) {

                        let user
                        
                        const data = jwt_verify(token)
                        if (data.type === 'recover') {
                            if (data.user_id) {
                                user = await User.findById(data.user_id)
                            }
                            if (user && user.password_change_date.getTime() != data.password_change_date) {
                                user = null
                            }
                        }

                        if (!user) {
                            throw Error("User not found")
                        }

                        let r = await update_user_creds(user, {password}, {require_old_password: false})

                        res.status(OK).json(data_message(!!r))

                    } else {
                        res.status(BAD_REQUEST).json(
                            error_message('Missing token or password')
                        )
                    }
                    
                } else if (req.method === 'put') {

                    const { name } = req.json

                    if (name) {
                        let user = await User.findOne({email: name})
                        if (!user) {
                            user = await User.findOne({username: name})
                        }
                        if (user) {
                            send_recover_email(user)
                        }
                        res.status(OK).json(data_message(true))
                    } else {
                        res.status(BAD_REQUEST).json(
                            error_message('Missing name')
                        )
                    }

                }
            } catch (err) {
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
