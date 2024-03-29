import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes'
import microCors from 'micro-cors'
import mongoose, { Document } from 'mongoose'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { create_conversation } from '@services/message'
import { create_commission } from '@services/commission'
import { update_user } from '@services/user'

const cors = microCors({ allowMethods: ['PUT', 'POST', 'OPTIONS'] })

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        try {
            const { data, model, method, populate, validate } = req.json

            let m = mongoose.models[model]

            if (!m) {
                throw Error(`Model '${model}' does not exist`)
            }

            let code = OK

            if (req.method === 'delete') {
                let r
                if (method) {
                    r = await m[method](data)
                } else {
                    r = await m.findByIdAndDelete(data)
                }

                res.status(r ? OK : BAD_REQUEST).json(
                    r
                        ? data_message('deleted')
                        : error_message('failed to delete')
                )
            } else {

                let doc: Document = null

                const create = req.method === 'put'

                if (create) {

                    code = CREATED

                    if (model === 'Conversation') {
                        doc = await create_conversation(req.user, data)
                    } else if (model === 'Commission') {
                        doc = await create_commission(req.user, data)
                    }
                }

                if (req.method === 'put') {
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
                        if (model === 'User') {
                            doc = await update_user(req.user, data, { save: false, document: doc })
                        } else {
                            doc.set(data)
                        }
                    }

                    if (validate) {
                        await doc.validate().catch(r => console.log(r))
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
                    res.status(NOT_FOUND).json(error_message('not found'))
                }
            }
        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)
