import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes'
import microCors from 'micro-cors'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { create_payout } from '@services/monetary'

const cors = microCors({ allowMethods: ['POST', 'OPTIONS'] })

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        try {
            const r = await create_payout(req.user)
            res.status(OK).json(data_message(r))
        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)
