import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { OK, BAD_REQUEST } from 'http-status-codes'

import { with_middleware, ExApiRequest, ExApiResponse } from '@server/middleware'
import { error_message, message } from '@utility/message'
import { logout_user } from '@services/user'
import * as pages from '@utility/pages'

const cors = microCors({ allowMethods: ['POST', 'GET'] })

/**
 * 
 * @api {GET|POST} /logout Logout active user
 * @apiName logout
 * @apiGroup Authentication
 * @apiVersion  0.1.0
 * @apiPermission auth
 * 
 * @apiParam  {Boolean} redirect Whether to redirect to home after successful logout
 * 
 * @apiSuccess (200) {String} msg Logout message
 * 
 * @apiParamExample  {JSON} Request-Example:
 * {
 *     redirect : true
 * }
 * 
 * 
 * @apiSuccessExample {JSON} Success-Response:
 * {
 *     msg : "Logged out"
 * }
 * 
 * 
 */
export default with_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        if (req.user) {
            const { redirect } = req.json
            await logout_user(req, res)
            if (redirect) {
                return res.redirect(302, pages.home)
            }
            return res.status(OK).json(message('Logged out'))
        } else {
            return res.status(BAD_REQUEST).json(error_message('No active user'))
        }
    }
)
