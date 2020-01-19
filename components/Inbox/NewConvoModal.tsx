import React, { useState } from 'react'
import {
    Modal,
    Button,
    Schema,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Input,
    InputGroup,
    Message,
    HelpBlock,
    Icon,
    IconButton,
} from 'rsuite'
import { useRouter } from 'next/router'

import { t } from '@app/utility/lang'
import useUserStore from '@store/user'
import useInboxStore from '@store/inbox'
import { useUser } from '@hooks/user'
import { make_conversation_urlpath } from '@utility/pages'
import { ButtonProps } from 'rsuite/lib/Button'

const {
    StringType,
    NumberType,
    BooleanType,
    ArrayType,
    ObjectType,
} = Schema.Types

const new_convo_model = Schema.Model({
    reciepient: StringType().isRequired(t`This field is required.`),
    subject: StringType()
        .addRule((value, data) => {
            if (value.length > 250) return false
            return true
        }, t`Subject must not exceed 250 characters`)
        .isRequired(t`This field is required.`),
})

interface NewConvoModalProps {
    show?: boolean
    defaultValue?: object
    onClose?: () => void
}

const NewConvoModal = (props: NewConvoModalProps) => {
    const store = useInboxStore()
    const user = useUser()
    const router = useRouter()

    const [loading, set_loading] = useState(false)
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState(props.defaultValue ?? {})
    const [error, set_error] = useState(null)

    return (
        <Modal
            backdrop={true}
            show={props.show}
            size="sm"
            onHide={props.onClose}>
            <Modal.Body>
                <h3>{t`Start a new conversation`}</h3>
                <Form
                    fluid
                    formValue={form_value}
                    model={new_convo_model}
                    ref={ref => set_form_ref(ref)}
                    onChange={value => set_form_value(value)}>
                    <FormGroup>
                        <ControlLabel>{t`Subject`}:</ControlLabel>
                        <FormControl
                            fluid
                            name="subject"
                            accepter={Input}
                            type="text"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{t`To`}:</ControlLabel>
                        <InputGroup>
                            <InputGroup.Addon>@</InputGroup.Addon>
                            <FormControl
                                fluid
                                name="reciepient"
                                defaultValue={props.defaultValue?.reciepient}
                                accepter={Input}
                                type="text"
                                required
                            />
                        </InputGroup>
                        <HelpBlock>{t`Need to contact a staff member? Start a conversation with the user "staff"`}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        {!!error && (
                            <Message type="error" description={error} />
                        )}
                    </FormGroup>
                    <p>
                        <Button
                            loading={loading}
                            appearance="primary"
                            type="submit"
                            block
                            onClick={async ev => {
                                ev.preventDefault()
                                if (form_ref && form_ref.check()) {
                                    set_loading(true)
                                    set_error(null)

                                    if (
                                        await useUserStore.actions.exists(
                                            form_value.reciepient
                                        )
                                    ) {
                                        try {
                                            const r = await store.new_conversation(
                                                user,
                                                form_value.subject,
                                                { to: form_value.reciepient }
                                            )

                                            if (r.status) {
                                                router.push(make_conversation_urlpath("inbox", r.body.data))
                                                if (props.onClose) {
                                                    props.onClose()
                                                }
                                            } else {
                                                if (r.body.error.includes("user only receives messages")) {
                                                    set_error(t`Reciepient has set limits on received messages`)
                                                } else {
                                                    set_error(t`Unknown error`)
                                                }
                                            }

                                        } catch (err) {
                                            set_error(err.message)
                                        }
                                    } else {
                                        set_error(t`User does not exists`)
                                    }

                                    set_loading(false)
                                }
                            }}>
                            {t`Confirm`}
                        </Button>
                    </p>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default NewConvoModal

export const NewMessageButton = ({appearance = "primary", icon=<Icon icon="plus" />, onClick = undefined, defaultValue = undefined, ...props}: ButtonProps & { defaultValue?: object }) => {

    const [show, set_show] = useState(false)

    return (
        <>
        <NewConvoModal
                    defaultValue={defaultValue}
                    show={show}
                    onClose={() => {
                        set_show(false)
                    }}
                />
        <IconButton
            appearance={appearance}
            icon={icon}
            onClick={ev => {
                ev.preventDefault()
                set_show(true)
            }}
            {...props}>
            {props.children}
            {!props.children &&
            t`New conversation`
            }
        </IconButton>
        </>    
    )
}