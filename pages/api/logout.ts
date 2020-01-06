import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { OK } from 'http-status-codes'

import { with_middleware, ExApiRequest, ExApiResponse } from '@server/middleware'
import { error_message, message } from '@utility/message'
import { logout_user } from '@services/user'
import * as pages from '@utility/pages'

const cors = microCors({ allowMethods: ['POST', 'GET'] })

export default with_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        if (req.user) {
            const { redirect } = req.json
            await logout_user(req, res)
            req.session = null
            if (redirect) {
                return res.redirect(302, pages.home)
            }
            res.status(OK).json(message('Logged out'))
        } else {
            res.status(OK).json(error_message('No active user'))
        }
    }
)
