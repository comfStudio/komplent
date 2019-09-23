import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes';
import microCors from 'micro-cors'
import mongoose, { Document } from 'mongoose'

import { error_message, data_message } from '@utility/message'
import { with_auth_middleware, ExApiRequest, ExApiResponse } from '@server/middleware'


const cors = microCors({ allowMethods: ['PUT', 'POST', 'OPTIONS'] })

export default cors(with_auth_middleware(async (req: ExApiRequest, res: ExApiResponse) => {
    try {
        const { data, model, populate } = req.json

        let m = mongoose.models[model]

        if (!m) {
            throw Error(`Model '${model}' does not exist`)
        }

        let code = OK

        let doc: Document = null

        if (req.method == 'put') {
            if (data._id) {
                doc = await m.findById(data._id)
            }
            if (!doc) {
                doc = new m(data)
                code = CREATED
            }
        } else {
            doc = await m.findById(data._id)
        }

        if (doc) {
            if (code !== CREATED) {
                doc.set(data)
            }
            await doc.save()
            if (populate) {
                let p_array = populate
                if (!Array.isArray(populate)) {
                    p_array = [populate]
                }
                for (let p of p_array) {
                    doc = doc.populate(p)
                }
                await doc.execPopulate()
            }
            res.status(code).json(data_message(doc.toJSON()))
        } else {
            res.status(NOT_FOUND).json(error_message("not found"))
        }
    } catch(err) {
        res.status(BAD_REQUEST).json(error_message(err.message))
    }
}))