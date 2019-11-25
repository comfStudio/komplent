import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes'
import microCors from 'micro-cors'
import mongoose from 'mongoose'

import { error_message, data_message } from '@utility/message'
import {
    with_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { promisify_es_search } from '@utility/misc'

const cors = microCors({ allowMethods: ['POST', 'OPTIONS'] })

export default with_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        try {
            const { model, query, options } = req.json

            let m = mongoose.models[model]

            if (!m) {
                throw Error(`Model '${model}' does not exist`)
            }

            let data: any = await promisify_es_search(m, query, options || {})

            res.status(OK).json(data_message(data))
        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err))
        }
    }
)
