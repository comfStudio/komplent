import React from 'react';

import { Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar, HelpBlock, Input, Panel, Icon, Divider } from 'rsuite'

import { HTMLElementProps } from '@app/utility/props'
import { t } from '@app/utility/lang'

import useUserStore from '@store/user'
import Link from 'next/link';

interface LoginFormProps extends HTMLElementProps {
    panel?: boolean
}

export const LoginForm = (props: LoginFormProps) => {

    const [user_store, user_actions] = useUserStore()

    let cls = "max-w-sm pl-3 p-1"
    cls = props.className ? cls + ' ' + props.className : cls

    let form = (
        <div>
            <Divider>{t`Login with`}</Divider>
            <ButtonToolbar>
                    <Button color="red" className="m-1" >
                    <Icon icon="google"/> Twitter
                    </Button>
                    <Button color="blue" className="m-1" >
                    <Icon icon="facebook-official"/> Facebook
                    </Button>
                    <Button color="cyan" className="m-1" >
                    <Icon icon="twitter"/> Twitter
                    </Button>
                    <Button color="blue" className="m-1" >
                    <Icon icon="linkedin"/> LinkedIn
                    </Button>
                    <Button color="cyan" className="m-1" >
                    Pixiv
                    </Button>
                </ButtonToolbar>
            <Divider>{t`Or using your email address`}</Divider>
            <Form className={cls} action="/api/login" method="post">
                <FormGroup>
                    <ControlLabel>{t`Username or Email address`}</ControlLabel>
                    <FormControl fluid name="name" accepter={Input} required />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{t`Password`}</ControlLabel>
                    <FormControl name="password" type="password" accepter={Input} required />
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                    <Button type="submit" block appearance="primary" onClick={() => user_actions.login('twiddly')}>{t`Login`}</Button>
                    </ButtonToolbar>
                </FormGroup>
                <div>{`Don't have an account yet?`}<Link href="/join"><a className="ml-1">{t`Join`}</a></Link></div>
            </Form>
        </div>
    )

    if (props.panel) {
        form = (<Panel bordered className="max-w-sm m-auto">{form}</Panel>)
    }
    return form
}

export default LoginForm;