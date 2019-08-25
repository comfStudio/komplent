import React, { Component } from 'react';

import { Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar, HelpBlock, Input, Panel } from 'rsuite'

import { HTMLElementProps } from '@app/utility/props'
import { t } from '@app/utility/lang'

interface LoginFormProps extends HTMLElementProps {
    panel?: boolean
}

export const LoginForm = (props: LoginFormProps) => {

    let cls = "max-w-sm pl-3 p-1"
    cls = props.className ? cls + ' ' + props.className : cls

    let form = (
        <Form className={cls} action="/login" method="post">
            <FormGroup>
                <ControlLabel>{t`Username`}</ControlLabel>
                <FormControl fluid name="name" accepter={Input} />
            </FormGroup>
            <FormGroup>
                <ControlLabel>{t`Password`}</ControlLabel>
                <FormControl name="password" type="password" accepter={Input} />
            </FormGroup>
            <FormGroup>
                <ButtonToolbar>
                <Button type="submit" block appearance="primary">{t`Login`}</Button>
                </ButtonToolbar>
            </FormGroup>
        </Form>
    )

    if (props.panel) {
        form = (<Panel bordered className="max-w-sm m-auto">{form}</Panel>)
    }
    return form
}

export default LoginForm;