import React, { useState } from 'react';
import { useSessionStorage } from 'react-use'
import { Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar,
        HelpBlock, Input, Panel, Divider, Icon, Schema, Message, InputNumber, Toggle, Uploader, List, Checkbox, Grid, Col, Row, CheckboxGroup, IconButton } from 'rsuite'

import { HTMLElementProps } from '@app/utility/props'
import { t } from '@app/utility/lang'
import { useUpdateDatabase, useDocument } from '@app/client/hooks/db';
import { useUser } from '@hooks/user';
import { comission_rate_schema, commission_extra_option_schema } from '@schema/commission'

const { StringType, NumberType, BooleanType, ArrayType, ObjectType } = Schema.Types;

interface RateOptionProps {
    price: number
    text: string
    edit?: boolean
    editing?: boolean
}


const RateOption = (props: RateOptionProps) => {

    const [editing, set_editing] = useState(props.editing)

    return (
        <React.Fragment>
            {(props.edit && !editing) && <IconButton icon={<Icon icon="close" />} circle size="xs" />}
            {editing &&
            <Grid fluid>
                <Row>
                    <Col xs={5}><span><InputNumber size="xs" defaultValue={props.price} /></span></Col>
                    <Col xs={12}><span><Input size="xs" defaultValue={props.text} /></span></Col>
                    <Col xs={3}><Button className="ml-2" size="xs" onClick={(ev) => {ev.preventDefault(); set_editing(false) }}>{t`Ok`}</Button></Col>
                    <Col xs={4}><Button className="ml-2" size="xs" onClick={(ev) => {ev.preventDefault(); set_editing(false) }}>{t`Cancel`}</Button></Col>
                </Row>
            </Grid>
            }
            {!editing && <span>{props.price} -</span>}
            {!editing && <span>{props.text}</span>}
            {(props.edit && !editing) && <Button className="ml-2" size="xs" onClick={(ev) => {ev.preventDefault(); set_editing(true) }}>{t`Edit`}</Button>}
        </React.Fragment>
    )
}

interface RateOptionsProps {
    edit?: boolean
    bordered?: boolean
    new?: boolean
    name?: string
    checkbox?: boolean
}

export const RateOptions = (props: RateOptionsProps) => {

    const [new_option, set_new_option] = useState(false)

    const [data, set_data] = useState([
        {text:'aTwiddly', value: 1},
        {text:'@twiddlyart', value: 2,},
        {text:'Twiddli', value: 3},
      ])

    return (
        <List className="" bordered={props.bordered}>
            <FormControl name={props.name || "options"} accepter={CheckboxGroup}>
            {
            data.map(({text, value},index) => {
                let opt = <RateOption edit={props.edit} price={20} text={text}/>
                if (props.checkbox) {
                   return (<Checkbox key={index} value={value} >{opt}</Checkbox>)
                } else {
                    return (
                        <List.Item key={index} index={index}>
                            {opt}
                        </List.Item>
                    )
                }
            })
            }
            {new_option && <List.Item><RateOption edit={true} editing={true} price={0} text=""/></List.Item>}
            {(props.new && !new_option) && <List.Item><Button size="sm" className="ml-5 pl-5" onClick={(ev) => {ev.preventDefault(); set_new_option(true) }}>{t`Add new option`}</Button></List.Item>}
            </FormControl>
        </List>
    )
}

export const RateOptionsForm = () => {

    return (
        <Form method="post" action="/api/update">
            <RateOptions edit new/>
        </Form>
    )
}

interface Props extends HTMLElementProps {
    panel?: boolean
    onDone?: CallableFunction
}

const rate_model = Schema.Model({
    title: StringType().isRequired(t`This field is required.`),
    description: StringType(),
    price: NumberType().isRequired('This field is required.'),
    negotiable: BooleanType(),
    options: ArrayType(),
    cover: ArrayType(),
  });

const CommissionRateForm = (props: Props) => {

    const current_user = useUser()
    const [document, set_document] = useDocument(comission_rate_schema)
    const update = useUpdateDatabase(undefined, comission_rate_schema, true, true)
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState({})
    const [error, set_error] = useState(null)
    const [loading, set_loading] = useState(false)


    let form = (
        <Form fluid method="post" action="/api/update" formValue={form_value} model={rate_model} ref={ref => (set_form_ref(ref))} onChange={(value => set_form_value(value))}>
            <FormGroup>
                    <ControlLabel>{t`Price`}:</ControlLabel>
                    <FormControl fluid name="price" prefix="$" accepter={InputNumber} type="number" required />
            </FormGroup>
            <FormGroup>
                    <ControlLabel>{t`Title`}:</ControlLabel>
                    <FormControl fluid name="title" accepter={Input} type="text" required />
            </FormGroup>
            <FormGroup>
                    <ControlLabel>{t`Description`}:</ControlLabel>
                    <FormControl rows={5} name="description" componentClass="textarea" />
            </FormGroup>
            <FormGroup>
                    <ControlLabel>{t`Negotiable`}:</ControlLabel>
                    <FormControl fluid name="negotiable" accepter={Toggle} required />
            </FormGroup>
            <FormGroup>
                    <h5>{t`Extra options`}</h5>
                    <RateOptions new checkbox/>
            </FormGroup>
            <FormGroup>
                    <h5>{t`Cover`}</h5>
                    <FormControl fluid name="cover" accepter={Uploader} listType="picture" required>
                    <button type="button">
                        <Icon icon='camera-retro' size="lg" />
                    </button>
                    </FormControl>
            </FormGroup>
            <FormGroup>
                <Grid fluid>
                    <Row>
                        <Col xs={8}>
                            <Button type="button" onClick={(ev) => {ev.preventDefault(); if (props.onDone) { props.onDone() }}}>{t`Cancel`}</Button>
                        </Col>
                        <Col xs={12} xsPush={4}>
                            <Button loading={loading} type="submit" block appearance="primary" onClick={async (ev) => { ev.preventDefault()
                            console.log(form_value)
                            if (form_ref && form_ref.check()) {
                                set_loading(true)
                                set_error(null)

                                set_document(form_value)

                                const {body, status} = await update("CommissionRate", document).then((d) => {
                                    set_loading(false)
                                    return d
                                })
                                if (!status) {
                                    set_error(body.error)
                                } else {
                                    if (props.onDone) {
                                        props.onDone()
                                    }
                                }
                            }}}>{t`Create`}</Button>
                        </Col>
                    </Row>
                </Grid>
                </FormGroup>
                <FormGroup>
                    {!!error && <Message type="error" description={error} />}
                </FormGroup>
        </Form>
    );

    if (props.panel) {
        form = (<Panel bordered className="max-w-md m-auto">{form}</Panel>)
    }

    return form
};

export default CommissionRateForm;