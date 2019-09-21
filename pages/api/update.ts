import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes';
import microCors from 'micro-cors'
import mongoose from 'mongoose'

import { error_message, data_message } from '@utility/message'
import { with_auth_middleware, ExApiRequest, ExApiResponse } from '@server/middleware'


const cors = microCors({ allowMethods: ['PUT', 'POST', 'OPTIONS'] })

export default cors(with_auth_middleware(async (req: ExApiRequest, res: ExApiResponse) => {
    try {
        const { data, model } = req.json

        let m = mongoose.models[model]

        if (!m) {
            throw Error(`Model '${model}' does not exist`)
        }

        let code = OK

        let document = null

        if (req.method == 'put') {
            if (data._id) {
                document = await m.findById(data._id)
            }
            if (!document) {
                document = new m(data)
                code = CREATED
            }
        } else {
            document = await m.findById(data._id)
        }
        
        if (document) {
            document.set(data)
            await document.save()
            res.status(code).json(data_message(document.toJSON()))
        } else {
            res.status(NOT_FOUND).json(error_message("not found"))
        }
    } catch(err) {
        res.status(BAD_REQUEST).json(error_message(err.message))
    }
}))