import { useState } from 'react'
import { Document, Schema } from 'mongoose/browser'

import { update_db } from '@app/client/db'

export const useUpdateDatabase = (existing_document?: Document | Object, validation_schema?: Schema, always_validate = true, always_create = false) => {
    const update = async (model: string, data: Document | Object, schema?: Schema, validate?: boolean, create?: boolean) => {

        const is_object = typeof data === 'object'

        if (validate === undefined) {
            validate = always_validate
        }

        if (schema === undefined) {
            schema = validation_schema
        }

        if (create === undefined) {
            create = always_create
        }
        
        if (existing_document) {
            data._id = existing_document._id
        }

        return await update_db({model, data: data, schema, validate, create})
        
    }
    return update
}

export const useDocument = (schema: Schema, initial_data?: object) => {
    let d: Document = initial_data ? initial_data : {}
    const [current_doc, set_current_doc] = useState(new Document(d, schema))

    const set_doc = (next_doc: Document) => {
        current_doc.set(typeof next_doc === 'object'? next_doc : next_doc.toObject())
        current_doc.validateSync()
        set_current_doc( current_doc ) // or maybe use Document.set(object)?
    }

    return [current_doc, set_doc]
}

export const useUpdateDocument = (initial_data?: object) => {
    let d: any = initial_data ? initial_data : {}
    const [current_doc, set_current_doc] = useState(d)

    const set_doc = (next_doc: object) => {
        set_current_doc({...next_doc})
    }

    return [current_doc, set_doc]
}