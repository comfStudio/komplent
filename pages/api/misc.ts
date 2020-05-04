import { NextApiRequest, NextApiResponse } from 'next'
import { NOT_FOUND, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import { with_middleware, ExApiRequest } from '@server/middleware'
import { user_has_password, send_activate_email } from '@services/user'

/**
 * 
 * @api {POST} /misc Miscellaneous utilities
 * @apiName Miscellaneous
 * @apiGroup Other
 * @apiPermission auth
 * @apiVersion  0.1.0
 * 
 * @apiParam  {Boolean} has_password=undefined Check if user has set a password
 * @apiParam  {Boolean} send_confirmation_email=undefined Send user an activation email
 * 
 * @apiSuccess (200) {Boolean} has_password Whether user has a password set
 * @apiSuccess (200) {Boolean} send_confirmation_email Email was sent successfully
 * 
 * @apiParamExample  {JSON} Request-Example:
 * {
 *     has_password : true
 *     send_confirmation_email : false
 * }
 * 
 * 
 * @apiSuccessExample {JSON} Success-Response:
 * {
 *     data: {
 *          has_password : true
 *        }
 * }
 * 
 * 
 */
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
