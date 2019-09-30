import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes';
import microCors from 'micro-cors'
import mongoose from 'mongoose'

import { error_message, data_message } from '@utility/message'
import { with_middleware, ExApiRequest, ExApiResponse } from '@server/middleware'


const cors = microCors({ allowMethods: ['POST', 'OPTIONS'] })

export default cors(with_middleware(async (req: ExApiRequest, res: ExApiResponse) => {
    try {
        const { query, model, method, populate, lean } = req.json

        let m = mongoose.models[model]

        if (!m) {
            throw Error(`Model '${model}' does not exist`)
        }

        let q = query
        if (!Array.isArray(query)) {
            q = [query]
        }

        let qmethod
        if (method) {
            qmethod = m[method](...q)
        } else {
            qmethod = m.find(...q)
        }

        
        if (populate) {
            let p_array = populate
            if (!Array.isArray(populate)) {
                p_array = [populate]
            }
            for (let p of p_array) {
                if (!Array.isArray(p)) {
                    p = [p]
                }
                qmethod = qmethod.populate(...p)
            }
        }

        if (qmethod.lean && lean !== false) {
            qmethod = qmethod.lean()
        }
        
        let data = await qmethod
        
        res.status(OK).json(data_message(data))

    } catch(err) {
        res.status(BAD_REQUEST).json(error_message(err.message))
    }
}))