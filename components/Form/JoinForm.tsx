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
import { useRouter } from 'next/router'
import { AuthButtons } from './LoginForm'
import Image from '@components/App/Image'
import { get_profile_avatar_url } from '@utility/misc'

const { StringType } = Schema.Types

const model_props = {
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
}

const join_model = Schema.Model({
    ...model_props,
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
    email: StringType()
    .isEmail(t`Please enter a valid email address.`)
    .isRequired(t`This field is required.`),
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
            <AuthButtons/>
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

const finish_join_model = Schema.Model({
    ...model_props,
    name: StringType()
    .addRule((value, data) => {
        if (value.length > 120) return false
        return true
    }, t`Name must not be longer than 160 characters`)
})

export const FinishJoinForm = (props: Props) => {
    const router = useRouter()
    const store = useUserStore()
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState({
        username: store.state.current_user.username,
        name: store.state.current_user.name,
    })
    const [join_error, set_join_error] = useState(null)
    const [loading, set_loading] = useState(false)

    let cls = 'max-w-md pl-3 p-1'
    cls = props.className ? cls + ' ' + props.className : cls

    let form = (
        <div>
            <Divider>{t`You're almost there...`}</Divider>
            <Form
                fluid
                className={cls}
                action="/api/join"
                method="post"
                formValue={form_value}
                model={finish_join_model}
                ref={ref => set_form_ref(ref)}
                onChange={value => set_form_value(value as any)}>
                <FormGroup className="text-center">
                    <div className="avatar !w-32 !h-32 inline-block">
                        <Image className="w-full h-full" src={get_profile_avatar_url(store.state.current_user)} w="100%" h="100%"/>
                    </div>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{t`Name`}:</ControlLabel>
                    <FormControl
                        fluid
                        name="name"
                        accepter={Input}
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
                                        .finish_join({...form_value, accessToken: router.query.token, provider: router.query.provider, user_id: router.query.user_id}, true)
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