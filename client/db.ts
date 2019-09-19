import { Document, Schema } from 'mongoose/browser'
import { OK, CREATED } from 'http-status-codes';

import { fetch } from '@utility/request'

export const clean = (doc: Document, model?: string) => {
    typeof doc === 'object' ? (delete doc.created) : (doc.created = undefined)
    return doc
}

export const update_db = async (model: string, document: Document | Object, schema?: Schema, validate?: boolean, create = false) => {

    const is_object = typeof document === 'object'

    document = clean(document, model)

    if (validate) {
        try {
            let validate_d = document
            if (is_object && schema) {
                validate_d = new Document(document, schema)
                Object.keys(document).forEach(v => {if (validate_d[v] !== undefined) document[v] = validate_d[v] })
            }
            await validate_d.validate()
        } catch (err) {
            let e = Error(err.message)
            e.stack = err.stack
            e.name = err.name
            console.log(e)
            throw e
        }
    }

    let data = { model, data: is_object ? document : document.toJSON() }

    let r = await fetch("api/update", {
        method: create ? 'put' : 'post',
        json: true,
        body: JSON.stringify(data)
    })

    return { body: await r.json(), status: (r.status == OK || r.status == CREATED) }
}