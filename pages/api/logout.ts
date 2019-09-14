import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { OK } from 'http-status-codes'

import { with_middleware, ExApiRequest } from '@server/middleware'
import { error_message, message } from '@utility/message'
import { logout_user } from '@server/db'

const cors = microCors({ allowMethods: ['POST', 'GET'] })

export default cors(with_middleware(async (req: ExApiRequest, res: NextApiResponse) => {
    if (req.user) {
        await logout_user(req, res)
        res.status(OK).json(message("Logged out"))
    } else {
        res.status(OK).json(error_message("No active user"))
    }
}))