import { NextApiRequest, NextApiResponse } from 'next'
import { NOT_FOUND, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import { ExApiRequest, with_auth_middleware } from '@server/middleware'
import { user_has_password, unlink_provider } from '@services/user'

export default with_auth_middleware(
    async (req: ExApiRequest, res: NextApiResponse) => {
        try {
            const { provider } = req.json

            await unlink_provider(req.user, provider)
            
            res.status(OK).json(data_message(true))

        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)
