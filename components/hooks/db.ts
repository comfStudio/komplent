import { useState } from 'react'
import { Document, Schema } from 'mongoose/browser'
import { OK } from 'http-status-codes';

import { IUser } from '@db/schema/user'
import { fetch } from '@utility/request'

export const clean = (doc: Document, model?: string) => {
    typeof doc === 'object' ? (delete doc.created) : (doc.created = undefined)
    return doc
}

export const useUpdate = (existing_document?: Document | Object, validation_schema?: Schema, always_validate = true) => {
    const update = async (model: string, document: Document | Object, schema?: Schema, validate?: boolean) => {

        const is_object = typeof document === 'object'

        if (validate === undefined) {
            validate = always_validate
        }

        if (schema === undefined) {
            schema = validation_schema
        }
        
        if (existing_document) {
            document._id = existing_document._id
        }

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
            method: 'put',
            json: true,
            body: JSON.stringify(data)
        })

        return (r.status == OK) 
    }
    return update
}

export const useDocument = (schema: Schema, initial_data?: object) => {
    let d: Document = initial_data ? initial_data : {}
    const [current_doc, set_current_doc] = useState(new Document(d, schema))

    const set_doc = (next_doc: Document) => {
        set_current_doc( new Document(next_doc.toObject(), schema))
    }

    return [current_doc, set_doc]
}

export const useUpdateDocument = (initial_data?: object) => {
    let d: object = initial_data ? initial_data : {}
    const [current_doc, set_current_doc] = useState(d)

    const set_doc = (next_doc: object) => {
        set_current_doc({...next_doc})
    }

    return [current_doc, set_doc]
}