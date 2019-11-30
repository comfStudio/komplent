import React, { useState } from 'react'
import {useDebounce } from 'react-use'

import TextEditor from '@components/App/TextEditor'
import useUserStore from '@store/user'
import { useUpdateDatabase } from '@hooks/db'
import { text_schema } from '@schema/general'
interface MessageTextProps {
    message_key?: string
    placeholder?: string
    maxLength?: number
    defaultValue?: any
    onChange?: (value) => void
}

export const MessageText = ({maxLength = 3500, ...props}: MessageTextProps) => {
    const store = useUserStore()
    const user = store.state.current_user
    const update = useUpdateDatabase(
        user[props.message_key] ?? null,
        text_schema,
        true
    )
    const [delta, set_delta] = useState()

    useDebounce(
        () => {
            if (props.message_key) {
                update(
                    'Text',
                    { data: delta },
                    text_schema,
                    true,
                    !!!user[props.message_key]
                ).then(r => {
                    if (r.status && !user[props.message_key]) {
                        let data = {}
                        data[props.message_key] = r.body.data
                        store.update_user(data)
                    }
                })
            }
            if (props.onChange) {
                props.onChange(delta)
            }
        },
        800,
        [delta]
    )

    return (
        <TextEditor
            defaultDelta={
                props.message_key ? (user[props.message_key]
                    ? user[props.message_key].data
                    : undefined) : props.defaultValue
            }
            maxLength={maxLength}
            placeholder={props.placeholder}
            onTextChange={({ delta }) => { set_delta(delta) } }
        />
    )
}

export default MessageText;