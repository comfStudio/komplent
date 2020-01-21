import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes'
import microCors from 'micro-cors'
import mongoose, { Document } from 'mongoose'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import {get_stages_limits } from '@services/commission'

const cors = microCors({ allowMethods: ['POST', 'OPTIONS'] })

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        try {
            const { stages_limit } = req.json

            let r
            if (stages_limit) {
                r = await get_stages_limits(req.user)
            } else {
            }

            res.status(OK).json(data_message(r))

        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)
