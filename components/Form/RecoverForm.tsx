import React, { useState, useContext } from 'react'

import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    ButtonToolbar,
    Button,
    Input,
    Panel,
    Schema,
    Message,
} from 'rsuite'

import { HTMLElementProps } from '@app/utility/props'
import { t } from '@app/utility/lang'
import { password_validate } from './JoinForm'
import { fetch } from '@utility/request'
import * as pages from '@utility/pages'

const { StringType } = Schema.Types

const recover_model = Schema.Model({
    name: StringType().isRequired(t`This field is required.`),
})

interface RecoverFormProps extends HTMLElementProps {
    panel?: boolean
}

export const RecoverForm = (props: RecoverFormProps) => {
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState({})
    const [loading, set_loading] = useState(false)
    const [status, set_status] = useState(false)

    let cls = 'max-w-sm pl-3 p-1'
    cls = props.className ? cls + ' ' + props.className : cls

    let form = (
        <div>
            <Form
                fluid
                className={cls}
                method="post"
                action="/api/recover"
                formValue={form_value}
                model={recover_model}
                ref={ref => set_form_ref(ref)}
                onSubmit={e => e.preventDefault()}
                onChange={value => set_form_value(value)}>
                <FormGroup>
                    <p>
                        {t`To recover your account, please provide your email or username associated with the account.`}
                    </p>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{t`Email address or username`}</ControlLabel>
                    <FormControl name="name" accepter={Input} required />
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                        <Button
                            loading={loading}
                            type="submit"
                            disabled={status}
                            block
                            appearance="primary"
                            onClick={async ev => {
                                ev.preventDefault()
                                if (form_ref && form_ref.check()) {
                                    set_loading(true)
                                    fetch("/api/recover", { method: "put", body: form_value }).then(r => {
                                        if (r.ok) {
                                            set_loading(false)
                                            set_status(true)
                                        }
                                    })
                                }
                            }}>{t`Recover`}</Button>
                    </ButtonToolbar>
                </FormGroup>
                {status &&
                <FormGroup>
                    <Message type="info" description={t`If we found an account associated with that username or email, we've sent password reset instructions to the email address on the account.`} />
                </FormGroup>
                }
            </Form>
        </div>
    )

    if (props.panel) {
        form = (
            <Panel bordered className="max-w-sm m-auto">
                {form}
            </Panel>
        )
    }
    return form
}

export default RecoverForm


const reset_model = Schema.Model({
    password: password_validate,
    repeat_password: StringType()
        .addRule((value, data) => {
            if (value !== data.password) {
                return false
            }
            return true
        }, 'The two passwords do not match')
        .isRequired('This field is required.'),
})


export const ResetPasswordForm = (props: { token: string } & RecoverFormProps) => {
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState({})
    const [loading, set_loading] = useState(false)
    const [status, set_status] = useState(null)

    let cls = 'max-w-sm pl-3 p-1'
    cls = props.className ? cls + ' ' + props.className : cls

    let form = (
        <div>
            <Form
                fluid
                className={cls}
                method="post"
                action="/api/recover"
                formValue={form_value}
                model={reset_model}
                ref={ref => set_form_ref(ref)}
                onSubmit={e => e.preventDefault()}
                onChange={value => set_form_value(value)}>
                <FormGroup>
                    <p>
                        {t`Please choose a new password`}
                    </p>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{t`Password`}:</ControlLabel>
                    <FormControl
                        name="password"
                        type="password"
                        accepter={Input}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{t`Repeat password`}:</ControlLabel>
                    <FormControl
                        name="repeat_password"
                        type="password"
                        accepter={Input}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                        <Button
                            loading={loading}
                            type="submit"
                            disabled={status}
                            block
                            appearance="primary"
                            onClick={async ev => {
                                ev.preventDefault()
                                if (form_ref && form_ref.check()) {
                                    set_loading(true)
                                    fetch("/api/recover", { method: "post", body: { token: props.token, password: form_value.password } }).then(r => {
                                        set_loading(false)
                                        if (r.ok) {
                                            set_status(true)
                                        } else {
                                            set_status(false)
                                        }
                                    })
                                }
                            }}>{t`Choose new password`}</Button>
                    </ButtonToolbar>
                </FormGroup>
                {status === true &&
                <FormGroup>
                    <Message type="success" description={t`We've successfully reset your password`} />
                </FormGroup>
                }
                {status === false &&
                <FormGroup>
                    <Message type="error" description={t`We couldn't changed your password. Your link might have expired.`} />
                </FormGroup>
                }
            </Form>
        </div>
    )

    if (props.panel) {
        form = (
            <Panel bordered className="max-w-sm m-auto">
                {form}
            </Panel>
        )
    }
    return form
}
