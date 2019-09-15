import { useState } from 'react'
import { Document, Schema } from 'mongoose/browser'

import { update_db } from '@app/client/db'

export const useUpdate = (existing_document?: Document | Object, validation_schema?: Schema, always_validate = true, always_create = false) => {
    const update = async (model: string, document: Document | Object, schema?: Schema, validate?: boolean, create = false) => {

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

        return await update_db(model, document, schema, validate, create)
        
    }
    return update
}

export const useDocument = (schema: Schema, initial_data?: object) => {
    let d: Document = initial_data ? initial_data : {}
    const [current_doc, set_current_doc] = useState(new Document(d, schema))

    const set_doc = (next_doc: Document) => {
        set_current_doc( new Document(next_doc.toObject(), schema)) // or maybe use Document.set(object)?
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