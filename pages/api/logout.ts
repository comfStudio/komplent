import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { OK } from 'http-status-codes'

import { with_user, ExApiRequest, JSONApiRequest, with_json, with_cookie } from '@server/middleware'
import { error_message, message } from '@utility/message'
import { logout_user } from '@server/db'

const cors = microCors({ allowMethods: ['POST', 'GET'] })

export default cors(with_cookie(with_user(with_json(async (req: ExApiRequest & JSONApiRequest, res: NextApiResponse) => {
    if (req.user) {
        await logout_user(req, res)
        res.status(OK).json(message("Logged out"))
    } else {
        res.status(OK).json(error_message("No active user"))
    }
}), false)))