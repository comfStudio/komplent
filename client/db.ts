import { Document, Schema } from 'mongoose/browser'
import { OK, CREATED } from 'http-status-codes';

import { fetch } from '@utility/request'

export const clean = (doc: Document, model?: string) => {
    typeof doc === 'object' ? (delete doc.created) : (doc.created = undefined)
    return doc
}

interface UpdateDBParams {
    model: string
    data: Document | object
    schema?: Schema
    validate?: boolean
    create?: boolean
}

export const update_db = async (params: UpdateDBParams) => {

    const is_object = typeof params.data === 'object'

    let doc = clean(params.data, params.model)
    
    if (params.validate) {
        try {
            let validate_d = doc
            if (is_object && params.schema) {
                validate_d = new Document({...doc}, params.schema)
                //Object.keys(doc).forEach(v => {if (validate_d[v] !== undefined) doc[v] = validate_d[v] })
            }
            if (typeof validate_d !== 'object') {
                await validate_d.validate()
            }
        } catch (err) {
            let e = Error(err.message)
            e.stack = err.stack
            e.name = err.name
            console.log(e)
            throw e
        }
    }
    
    let data = { model: params.model, data: is_object ? doc : doc.toJSON() }

    let r = await fetch("/api/update", {
        method: params.create ? 'put' : 'post',
        json: true,
        body: data
    })

    return { body: await r.json(), status: (r.status == OK || r.status == CREATED), code: r.status }
}