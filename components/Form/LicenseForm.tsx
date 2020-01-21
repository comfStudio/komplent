import React, { useState } from 'react';
import { List, FormControl, CheckboxGroup, Schema, Button, Checkbox, Grid, Row, Col, Icon, Form, Modal, FormGroup, ControlLabel, Input, HelpBlock, Radio, RadioGroup } from 'rsuite';

import { useCommissionRateStore } from '@store/commission';
import { useUser } from '@hooks/user';
import { t } from '@app/utility/lang'
import TextEditor from '@components/App/TextEditor';
import MessageText from '@components/App/MessageText';

const {
    StringType,
    NumberType,
    BooleanType,
    ArrayType,
    ObjectType,
} = Schema.Types

interface LicenseItemProps {
    data: any
    edit?: boolean
}

const LicenseItem = (props: LicenseItemProps) => {
    const [edit_license, set_edit_license] = useState(false)
    const store = useCommissionRateStore()

    return (
        <React.Fragment>
            <LicenseModal data={props.data} show={edit_license} onSubmit={v => store.update_license({...props.data, ...v}, {create: false})} onClose={() => set_edit_license(false)}/>
            {props.edit && (
                <a href="#" onClick={ev => {
                    ev.preventDefault()
                    store.delete_license(props.data._id)
                }}>
                    <Icon className="mr-2" icon="minus-circle"/>
                </a>
            )}
            <span>{props.data.name}</span>
            {props.edit && (
                <Button
                    className="ml-2"
                    size="xs"
                    onClick={ev => {
                        ev.preventDefault()
                        set_edit_license(true)
                    }}>{t`Edit`}</Button>
            )}
        </React.Fragment>
    )
}

const license_model = Schema.Model({
    name: StringType().isRequired('This field is required.'),
    description: StringType().isRequired('This field is required.')
        .addRule((value, data) => {
            if (value.length > 255) return false
            return true
        }, t`Description must be less than 255 characters`),
    body: ObjectType().isRequired('This field is required.')
})


interface LicenseModalProps {
    data?: any
    show?: boolean
    onSubmit?: (value) => any
    onClose?: Function
}

const LicenseModal = (props: LicenseModalProps) => {
    const [form_value, set_form_value] = useState({
        name: props?.data?.name,
        description: props?.data?.description,
        body: props?.data?.body
    })
    const [loading, set_loading] = useState(false)
    const [form_ref, set_form_ref] = useState(null)

    const on_close = () => { if (props.onClose) props.onClose() }

    return (
        <Modal overflow={true} size="lg" backdrop="static" show={props.show} onHide={on_close}>
            <Form fluid method="put"
                action="/api/update"
                formValue={form_value}
                model={license_model}
                ref={ref => set_form_ref(ref)}
                onChange={value => set_form_value(value)}>
                <Modal.Header>
                    <Modal.Title>{t`Create a new agreement`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <ControlLabel>
                            {t`Name`}:
                        </ControlLabel>
                        <FormControl accepter={Input} type="text" fluid name="name"/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>
                            {t`Description`}:
                        </ControlLabel>
                        <FormControl componentClass="textarea" rows={4} maxLength={255} fluid name="description"/>
                        <HelpBlock>{t`A short TLDR version of your agreement`}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>
                            {t`Body`}:
                        </ControlLabel>
                        <FormControl accepter={MessageText} maxLength={8000} name="body"/>
                        <HelpBlock>{t`The full version of your agreement`}</HelpBlock>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" loading={loading} onClick={ev => {
                        ev.preventDefault()
                        if (form_ref && form_ref.check()) {
                            set_loading(true)
                            if (props.onSubmit) props.onSubmit(form_value)
                            on_close()

                        }}} appearance="primary">
                    {t`Save`}
                    </Button>
                    <Button type="button" onClick={on_close} appearance="subtle">
                    {t`Cancel`}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}


interface LicenseListProps {
    edit?: boolean
    bordered?: boolean
    new?: boolean
    name?: string
    radiobox?: boolean
    licenses?: Array<string>
}

export const LicenseList = (props: LicenseListProps) => {
    const [new_license, set_new_license] = useState(false)
    const store = useCommissionRateStore()
    const user = useUser()
    const licenses = props.licenses
        ? props.licenses
        : store.state.licenses.map(({ _id }) => _id)

    return (
        <List className="" bordered={props.bordered}>
            <LicenseModal show={new_license} onSubmit={v => store.update_license({...v, user}, {create: true})} onClose={() => set_new_license(false)}/>
            <FormControl name={props.name || 'license'} accepter={RadioGroup}>
                {props.radiobox && 
                <Radio value={null}>
                    {t`None`}
                </Radio>
                }
                {store.state.licenses
                    .filter(({ _id }) => licenses.includes(_id))
                    .map((data, index) => {
                        let opt = (
                            <LicenseItem
                                edit={props.edit}
                                data={data}
                            />
                        )
                        if (props.radiobox) {
                            return (
                                <Radio key={data._id} value={data._id}>
                                    {opt}
                                </Radio>
                            )
                        } else {
                            return (
                                <List.Item key={data._id} index={index}>
                                    {opt}
                                </List.Item>
                            )
                        }
                    })}
                {props.new && !new_license && (
                    <List.Item>
                        <Button
                            size="sm"
                            className="ml-5 pl-5"
                            onClick={ev => {
                                ev.preventDefault()
                                set_new_license(true)
                            }}>{t`Add new agreement`}</Button>
                    </List.Item>
                )}
            </FormControl>
        </List>
    )
}

const LicenseForm = () => {
    return (
        <Form method="post" action="/api/update">
            <LicenseList edit new />
        </Form>
    );
};

export default LicenseForm;
