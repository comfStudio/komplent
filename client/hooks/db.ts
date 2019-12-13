import { useState, useEffect } from 'react'
import { Document, Schema } from 'mongoose/browser'
import { useMount } from 'react-use'
import dompurify from 'dompurify'

import { update_db } from '@app/client/db'
import { fetch } from '@utility/request'
import { is_server } from '@utility/misc'

const Quill = is_server() ? undefined : require('quill')

export const useUpdateDatabase = (
    existing_document?: Document | Object,
    validation_schema?: Schema,
    always_validate = true,
    always_create = false
) => {
    const update = async (
        model: string,
        data: Document | Object,
        schema?: Schema,
        validate?: boolean,
        create?: boolean
    ) => {
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

        return await update_db({ model, data: data, schema, validate, create })
    }
    return update
}

export const useDocument = (schema: Schema, initial_data?: object) => {
    let d: Document = initial_data ? initial_data : {}
    const [current_doc, set_current_doc] = useState(new Document(d, schema))

    const set_doc = (next_doc: Document) => {
        current_doc.set(
            typeof next_doc === 'object' ? next_doc : next_doc.toObject()
        )
        current_doc.validateSync()
        set_current_doc(current_doc) // or maybe use Document.set(object)?
    }

    return [current_doc, set_doc]
}

export const useUpdateDocument = (initial_data?: object) => {
    let d: any = initial_data ? initial_data : {}
    const [current_doc, set_current_doc] = useState(d)

    const set_doc = (next_doc: object) => {
        set_current_doc({ ...next_doc })
    }

    return [current_doc, set_doc]
}

export const messageTextToHTML = (data: any) => {
    let h
    if (data && !is_server()) {
        const q = new Quill(document.createElement('div'))
        q.setContents(data)
        h = dompurify.sanitize(q.root.innerHTML)
    }
    return h
}

export const useMessageTextToHTML = (data: any) => {
    let [html, set_html] = useState()
    useEffect(() => {
        if (!is_server() && data) {
            set_html(messageTextToHTML(data))
        }
    }, [data])
    
    return html
}

export const useDatabaseTextToHTML = (id: string) => {
    let [data, set_delta] = useState()
    useMount(() => {
        if (id) {
            fetch('/api/fetch', {
                method: 'post',
                body: { model: 'Text', method: 'findById', query: id },
            }).then(async r => {
                if (r.ok) {
                    set_delta((await r.json()).data.data)
                }
                return undefined
            })
        }
    })

    return messageTextToHTML(data)
}
