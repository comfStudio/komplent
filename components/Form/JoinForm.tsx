import React from 'react';

import { Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar, HelpBlock, Input, Panel, Divider, Icon } from 'rsuite'

import { HTMLElementProps } from '@app/utility/props'
import { t } from '@app/utility/lang'

import useUserStore from '@store/user'
import Link from 'next/link';

interface Props extends HTMLElementProps {
    panel?: boolean
}

export const JoinForm = (props: Props) => {

    const [user_store, user_actions] = useUserStore()

    let cls = "max-w-md pl-3 p-1"
    cls = props.className ? cls + ' ' + props.className : cls

    let form = (
        <div>
            <Divider>{t`Join with`}</Divider>
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
            <Form className={cls} action="/api/join" method="post">
                <FormGroup>
                    <ControlLabel>{t`Email address`}:</ControlLabel>
                    <FormControl fluid name="email" accepter={Input} type="email" required />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{t`Username`}:</ControlLabel>
                    <FormControl fluid name="name" accepter={Input} required />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{t`Password`}:</ControlLabel>
                    <FormControl name="password" type="password" accepter={Input} required />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{t`Repeat password`}:</ControlLabel>
                    <FormControl name="password" type="password" accepter={Input} required />
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                    <Button type="submit" block appearance="primary">{t`Join`}</Button>
                    </ButtonToolbar>
                </FormGroup>
                <div>{`Already have an account?`}<Link href="/login"><a className="ml-1">{t`Log in`}</a></Link></div>
            </Form>
        </div>
    )

    if (props.panel) {
        form = (<Panel bordered className="max-w-md m-auto">{form}</Panel>)
    }
    return form
}

export default JoinForm;