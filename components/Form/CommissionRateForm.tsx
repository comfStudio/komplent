import React, { useState } from 'react';
import { useSessionStorage, useMount } from 'react-use'
import { Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar,
        HelpBlock, Input, Panel, Divider, Icon, Schema, Message, InputNumber, Toggle, Uploader, List, Checkbox, Grid, Col, Row, CheckboxGroup, IconButton } from 'rsuite'

import { HTMLElementProps } from '@app/utility/props'
import { t } from '@app/utility/lang'
import { useUpdateDatabase, useDocument } from '@app/client/hooks/db';
import { useUser } from '@hooks/user';
import { comission_rate_schema, commission_extra_option_schema } from '@schema/commission'
import { useCommissionRateStore } from '@client/store/commission';
import { Decimal128 } from 'bson';
import { decimal128ToFloat, decimal128ToMoneyToString, stringToDecimal128 } from '@utility/misc';
import log from '@utility/log';

const { StringType, NumberType, BooleanType, ArrayType, ObjectType } = Schema.Types;

interface RateOptionProps {
    price: Decimal128
    title: string
    edit?: boolean
    editing?: boolean
    onUpdate?: Function
    onCancel?: Function
}


const RateOption = (props: RateOptionProps) => {

    const [editing, set_editing] = useState(props.editing)
    const [dirty, set_dirty] = useState(false)
    const [price, set_price] = useState(props.price)
    const [title, set_title] = useState(props.title)

    return (
        <React.Fragment>
            {(props.edit && !editing) && <IconButton icon={<Icon icon="close" />} circle size="xs" />}
            {editing &&
            <Grid fluid>
                <Row>
                    <Col xs={5}><span><InputNumber size="xs" defaultValue={decimal128ToFloat(price).toString()} onChange={(v) => set_price(stringToDecimal128(v.toString()))} /></span></Col>
                    <Col xs={12}><span><Input size="xs" defaultValue={props.title} onChange={(v: string) => set_title(v)} /></span></Col>
                    <Col xs={3}><Button className="ml-2" size="xs" onClick={(ev) => {ev.preventDefault(); if(props.onUpdate && title){ props.onUpdate({title, price})} set_dirty(true); set_editing(false);}}>{t`Update`}</Button></Col>
                    <Col xs={4}><Button className="ml-2" size="xs" onClick={(ev) => {ev.preventDefault();  if(props.onCancel){ props.onCancel()} set_editing(false) }}>{t`Cancel`}</Button></Col>
                </Row>
            </Grid>
            }
            {!editing && <span>{decimal128ToMoneyToString(props.price)}</span>}
            {!editing && <span> - {props.title}</span>}
            {(props.edit && !editing) && <Button className="ml-2" size="xs" onClick={(ev) => {ev.preventDefault(); set_dirty(true); set_editing(true) }}>{t`Edit`}</Button>}
        </React.Fragment>
    )
}

interface RateOptionsProps {
    edit?: boolean
    bordered?: boolean
    new?: boolean
    name?: string
    checkbox?: boolean
    options?: Array<string>
}

export const RateOptions = (props: RateOptionsProps) => {

    const [new_option, set_new_option] = useState(false)
    const store = useCommissionRateStore()
    const user = useUser()
    const options = props.options ? props.options : store.state.options.map(({_id}) => _id)

    return (
        <List className="" bordered={props.bordered}>
            <FormControl name={props.name || "extras"} accepter={CheckboxGroup}>
            {
            store.state.options.filter(({_id}) => options.includes(_id)).map(({title, price, _id},index) => {
                let opt = <RateOption edit={props.edit} price={price} title={title} onUpdate={(v) => log.info(v)}/>
                if (props.checkbox) {
                   return (<Checkbox key={_id} value={_id} >{opt}</Checkbox>)
                } else {
                    return (
                        <List.Item key={_id} index={index}>
                            {opt}
                        </List.Item>
                    )
                }
            })
            }
            {new_option && <List.Item><RateOption edit={true} editing={true} price={stringToDecimal128("0")} title="" onUpdate={(v) => {store.create_option({user:user._id, ...v}); set_new_option(false)}} onCancel={() => {set_new_option(false) }}/></List.Item>}
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
    commission_deadline: NumberType(),
    negotiable: BooleanType(),
    extras: ArrayType(),
    cover: ArrayType(),
  });

const CommissionRateForm = (props: Props) => {

    const current_user = useUser()
    const [doc, set_document] = useDocument(comission_rate_schema)
    const store = useCommissionRateStore()
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState()
    const [error, set_error] = useState(null)
    const [loading, set_loading] = useState(false)


    let form = (
        <Form fluid method="put" action="/api/update" formDefaultValue={{extras: store.state.options.map((v) => v._id)}} formValue={form_value} model={rate_model} ref={ref => (set_form_ref(ref))} onChange={(value => set_form_value(value))}>
            <FormGroup>
                    <ControlLabel>{t`Title`}:</ControlLabel>
                    <FormControl fluid name="title" accepter={Input} type="text" required />
            </FormGroup>
            <FormGroup>
                    <ControlLabel>{t`Price`}:</ControlLabel>
                    <FormControl fluid name="price" prefix="$" accepter={InputNumber} type="number" required />
            </FormGroup>
            <FormGroup>
                    <ControlLabel>{t`Deadline`}:</ControlLabel>
                    <FormControl fluid name="commission_deadline" placeholder="14" postfix={t`days`} accepter={InputNumber} type="number" />
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
                            if (form_ref && form_ref.check()) {
                                set_loading(true)
                                set_error(null)

                                if (!form_value.deadline) {
                                    form_value.deadline = undefined
                                }

                                set_document({user:current_user._id, ...form_value})

                                const {body, status} = await store.create_rate(doc).then((d) => {
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