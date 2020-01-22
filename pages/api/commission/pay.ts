import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes'
import microCors from 'micro-cors'
import mongoose, { Document } from 'mongoose'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { pay_commission } from '@services/commission'

const cors = microCors({ allowMethods: ['PUT', 'POST', 'OPTIONS'] })

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        try {
            const { commission_id, payment_phase_id } = req.json

            const r = await pay_commission(req.user, commission_id, payment_phase_id)

            res.status(OK).json(data_message(r))

        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)
