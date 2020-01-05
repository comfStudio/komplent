import React, { useState, useContext } from 'react'
import qs from 'qs'

import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Button,
    ButtonToolbar,
    Input,
    Panel,
    Icon,
    Divider,
    Schema,
    Message,
} from 'rsuite'

import { HTMLElementProps } from '@app/utility/props'
import { t } from '@app/utility/lang'
import { LoginContext } from '@client/context'
import useUserStore from '@client/store/user'
import Link from 'next/link'
import { useRouter } from 'next/router'

const { StringType } = Schema.Types

const login_model = Schema.Model({
    name: StringType().isRequired(t`This field is required.`),
    password: StringType().isRequired('This field is required.'),
})

interface LoginFormProps extends HTMLElementProps {
    panel?: boolean
}

export const AuthButtons = ({ next_page = undefined }: {next_page?: string}) => {

    const router = useRouter()

    next_page = next_page ? "?" + qs.stringify({ ...router.query, next: next_page }) : ""
    
    return (
    <ButtonToolbar>
        <Link href={`/api/auth/google${next_page}`} passHref>
            <Button color="red" className="m-1" componentClass="a">
                <Icon icon="google" /> Google
            </Button>
        </Link>
        <Link href={`/api/auth/facebook${next_page}`} passHref>
            <Button color="blue" className="m-1" componentClass="a">
                <Icon icon="facebook-official" /> Facebook
            </Button>
        </Link>
        <Link href={`/api/auth/twitter${next_page}`} passHref>
            <Button color="cyan" className="m-1" componentClass="a">
                <Icon icon="twitter" /> Twitter
            </Button>
        </Link>
        <Link href={`/api/auth/instagram${next_page}`} passHref>
            <Button color="cyan" className="m-1" componentClass="a">
                <Icon icon="instagram" /> Instagram
            </Button>
        </Link>
        {/* <Link href={`/api/auth/pixiv${next_page}`} passHref>
            <Button color="cyan" className="m-1" componentClass="a">
                <Icon icon="pixiv" /> Pixiv
            </Button>
        </Link> */}
    </ButtonToolbar>
    )
}

export const LoginForm = (props: LoginFormProps) => {
    const store = useUserStore()
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState({})
    const [login_error, set_login_error] = useState(null)
    const [loading, set_loading] = useState(false)
    const { next_page } = useContext(LoginContext)

    let cls = 'max-w-sm pl-3 p-1'
    cls = props.className ? cls + ' ' + props.className : cls

    let form = (
        <div>
            <Divider>{t`Login with`}</Divider>
            <AuthButtons/>
            <Divider>{t`Or using your email address`}</Divider>
            <Form
                fluid
                className={cls}
                method="post"
                action="/api/login"
                formValue={form_value}
                model={login_model}
                ref={ref => set_form_ref(ref)}
                onSubmit={e => e.preventDefault()}
                onChange={value => set_form_value(value)}>
                <FormGroup>
                    <ControlLabel>{t`Email address or Username`}</ControlLabel>
                    <FormControl name="name" accepter={Input} required />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{t`Password`}</ControlLabel>
                    <FormControl
                        name="password"
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
                                    set_login_error(null)
                                    let [status, err] = await store
                                        .login(form_value, next_page)
                                        .then(d => {
                                            set_loading(false)
                                            return d
                                        })
                                    if (!status) {
                                        if (err.includes('not exists')) {
                                            err = t`Wrong email/username or password`
                                        }
                                        set_login_error(err)
                                    }
                                }
                            }}>{t`Login`}</Button>
                    </ButtonToolbar>
                </FormGroup>
                <FormGroup>
                    {!!login_error && (
                        <Message type="error" description={login_error} />
                    )}
                </FormGroup>
                <div>
                    {`Don't have an account yet?`}
                    <Link href="/join">
                        <a className="ml-1">{t`Join`}</a>
                    </Link>
                </div>
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

export default LoginForm
