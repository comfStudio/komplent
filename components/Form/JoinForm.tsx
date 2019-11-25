import React, { useState } from 'react'

import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Button,
    ButtonToolbar,
    HelpBlock,
    Input,
    Panel,
    Divider,
    Icon,
    Schema,
    Message,
} from 'rsuite'

import { HTMLElementProps } from '@app/utility/props'
import { t } from '@app/utility/lang'

import useUserStore from '@client/store/user'
import Link from 'next/link'

const { StringType } = Schema.Types

const join_model = Schema.Model({
    email: StringType()
        .isEmail(t`Please enter a valid email address.`)
        .isRequired(t`This field is required.`),
    username: StringType()
        .addRule((value, data) => {
            if (value.length < 3) return false
            return true
        }, t`Username must be longer than 2 characters`)
        .addRule((value, data) => {
            let illegal_chars = /\W/
            if (illegal_chars.test(value)) return false
            return true
        }, t`Username must only contain letter, numbers and underscores`)
        .isRequired(t`This field is required.`),
    password: StringType()
        .isRequired('This field is required.')
        .addRule((value, data) => {
            if (value.length < 8) {
                return false
            }
            return true
        }, 'Password must be longer than 7 characters'),
    repeat_password: StringType()
        .addRule((value, data) => {
            if (value !== data.password) {
                return false
            }
            return true
        }, 'The two passwords do not match')
        .isRequired('This field is required.'),
})

interface Props extends HTMLElementProps {
    panel?: boolean
}

export const JoinForm = (props: Props) => {
    const store = useUserStore()
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState({})
    const [join_error, set_join_error] = useState(null)
    const [loading, set_loading] = useState(false)

    let cls = 'max-w-md pl-3 p-1'
    cls = props.className ? cls + ' ' + props.className : cls

    let form = (
        <div>
            <Divider>{t`Join with`}</Divider>
            <ButtonToolbar>
                <Button color="red" className="m-1">
                    <Icon icon="google" /> Twitter
                </Button>
                <Button color="blue" className="m-1">
                    <Icon icon="facebook-official" /> Facebook
                </Button>
                <Button color="cyan" className="m-1">
                    <Icon icon="twitter" /> Twitter
                </Button>
                <Button color="blue" className="m-1">
                    <Icon icon="linkedin" /> LinkedIn
                </Button>
                <Button color="cyan" className="m-1">
                    Pixiv
                </Button>
            </ButtonToolbar>
            <Divider>{t`Or using your email address`}</Divider>
            <Form
                fluid
                className={cls}
                action="/api/join"
                method="post"
                formValue={form_value}
                model={join_model}
                ref={ref => set_form_ref(ref)}
                onChange={value => set_form_value(value)}>
                <FormGroup>
                    <ControlLabel>{t`Email address`}:</ControlLabel>
                    <FormControl
                        fluid
                        name="email"
                        accepter={Input}
                        type="email"
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{t`Username`}:</ControlLabel>
                    <FormControl
                        fluid
                        name="username"
                        accepter={Input}
                        required
                    />
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
                            block
                            appearance="primary"
                            onClick={async ev => {
                                ev.preventDefault()
                                if (form_ref && form_ref.check()) {
                                    set_loading(true)
                                    set_join_error(null)
                                    const [status, err] = await store
                                        .join(form_value, true)
                                        .then(d => {
                                            set_loading(false)
                                            return d
                                        })
                                    if (!status) {
                                        set_join_error(err)
                                    }
                                }
                            }}>{t`Join`}</Button>
                    </ButtonToolbar>
                </FormGroup>
                <FormGroup>
                    {!!join_error && (
                        <Message type="error" description={join_error} />
                    )}
                </FormGroup>
                <div>
                    {`Already have an account?`}
                    <Link href="/login">
                        <a className="ml-1">{t`Log in`}</a>
                    </Link>
                </div>
            </Form>
        </div>
    )

    if (props.panel) {
        form = (
            <Panel bordered className="max-w-md m-auto">
                {form}
            </Panel>
        )
    }
    return form
}

export default JoinForm
