import React, { useState, useRef, useEffect, SyntheticEvent } from 'react';
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
import { decimal128ToFloat, decimal128ToMoneyToString, stringToDecimal128, decimal128ToMoney } from '@utility/misc';
import log from '@utility/log';
import * as pages from '@utility/pages';
import { get_authorization_header } from '@utility/request';

const { StringType, NumberType, BooleanType, ArrayType, ObjectType } = Schema.Types;

interface RateOptionProps {
    price: Decimal128
    title: string
    edit?: boolean
    editing?: boolean
    onUpdate?: Function
    onRemove?: (event: SyntheticEvent<Element, Event>) => void
    onCancel?: Function
}


const RateOption = (props: RateOptionProps) => {

    const [editing, set_editing] = useState(props.editing)
    const [dirty, set_dirty] = useState(false)
    const [price, set_price] = useState(props.price)
    const [title, set_title] = useState(props.title)

    return (
        <React.Fragment>
            {(props.edit && !editing) && <IconButton onClick={props.onRemove} icon={<Icon icon="close" />} circle size="xs" />}
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
                let opt = <RateOption edit={props.edit} price={price} title={title}
                onRemove={() => {store.delete_option(_id).then(async r => {if (r.status) store.setState(await store.load(user, {rates: false}))})}}
                onUpdate={(v) => store.update_option({_id, ...v}, {create: false})}/>
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
            {new_option && <List.Item><RateOption edit={true} editing={true} price={stringToDecimal128("0")} title="" onUpdate={(v) => {store.update_option({user:user._id, ...v}, {create: true}); set_new_option(false)}} onCancel={() => {set_new_option(false) }}/></List.Item>}
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
    defaultData?: any
}

const rate_model = Schema.Model({
    title: StringType().isRequired(t`This field is required.`),
    description: StringType(),
    price: NumberType().isRequired('This field is required.'),
    commission_deadline: NumberType(),
    extras: ArrayType(),
  });

const CommissionRateForm = (props: Props) => {

    const current_user = useUser()
    const [doc, set_document] = useDocument(comission_rate_schema)
    const store = useCommissionRateStore()
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState()
    const [error, set_error] = useState(null)
    const [loading, set_loading] = useState(false)

    const [default_filelist, set_default_filelist] = useState([])
    const [filelist, set_filelist] = useState([])
    const [uploading, set_uploading] = useState(false)
    const [upload_response, set_upload_response] = useState(undefined)
    const [submit_value, set_submit_value] = useState()
    const uploader = useRef<any>()

    useEffect(() => {
        if (props.defaultData) {
            set_form_value({...props.defaultData, price: decimal128ToFloat(props.defaultData.price),
                extras: props.defaultData?.extras.map(v => v._id)})
            if (props.defaultData.image?.paths?.length) {
                set_default_filelist([{
                    name: 'image_' + props.defaultData._id,
                    fileKey: 1,
                    url:props.defaultData.image.paths[0].url
                  }])
            } else {
                set_default_filelist([])
            }
        }
    }, [props.defaultData])

    useEffect(() => {
        if (!uploading && submit_value) {

            if (!submit_value.deadline) {
                submit_value.deadline = undefined
            }
    
            set_document({user:current_user._id, ...submit_value, image: upload_response, _id: props?.defaultData._id})
    
            store.create_rate(doc, {create: !!!props.defaultData}).then(({body, status}) => {
                set_loading(false)
                if (!status) {
                    set_error(body.error)
                } else {
                    if (props.onDone) {
                        props.onDone()
                    }
                }
            })
        }
    }, [uploading, submit_value])

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
                    <h5>{t`Extra options`}</h5>
                    <RateOptions new checkbox/>
            </FormGroup>
            <FormGroup>
                    <h5>{t`Cover`}</h5>
                    <Uploader fluid data={{type: "CommissionRate"}} action={pages.upload} ref={uploader}
                        accept="image/*" listType="picture" fileList={ filelist.length ? filelist : default_filelist } autoUpload={false} multiple={false}
                        withCredentials={true} headers={get_authorization_header()}
                        onChange={(f) => {set_filelist([f[f.length-1]])}}
                        onSuccess={(r)=> { set_upload_response(r?.data); set_uploading(false) }}>
                    <button type="button">
                        <Icon icon='camera-retro' size="lg" />
                    </button>
                    </Uploader>
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

                                if (filelist.length) {
                                    await uploader.current.start()
                                    set_uploading(true)
                                }
                                set_submit_value(form_value)
                            }}}>{props.defaultData ? t`Update` : t`Create`}</Button>
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