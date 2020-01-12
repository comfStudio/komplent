import { NextApiRequest, NextApiResponse } from 'next'
import { NOT_FOUND, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import { with_middleware, ExApiRequest } from '@server/middleware'
import { user_has_password, send_activate_email } from '@services/user'

export default with_middleware(
    async (req: ExApiRequest, res: NextApiResponse) => {
        try {
            const { has_password, send_confirmation_email } = req.json

            let d: any = {}

            if (has_password && req.user) {
                d.has_password = await user_has_password(req.user._id)
            }

            if (send_confirmation_email && req.user) {
                d.send_confirmation_email = send_activate_email(req.user)
            }
            
            res.status(OK).json(data_message(d))
        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)