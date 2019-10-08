import React from 'react';

import React, { useState } from 'react';
import { useSessionStorage, useMount } from 'react-use'
import { Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar,
        HelpBlock, Input, Panel, Divider, Icon, Schema, Message, InputNumber, Toggle, Uploader, List, Checkbox, Grid, Col, Row, CheckboxGroup, IconButton } from 'rsuite'

import { HTMLElementProps } from '@app/utility/props'
import { t } from '@app/utility/lang'
import { useUser } from '@hooks/user';
import { useCommissionRateStore } from '@client/store/commission';
import log from '@utility/log';

const { StringType, NumberType, BooleanType, ArrayType, ObjectType } = Schema.Types;

interface CommissionGuidelineTextProps {
    title: string
    edit?: boolean
    editing?: boolean
    onUpdate?: Function
    onCancel?: Function
}


const CommissionGuidelineText = (props: CommissionGuidelineTextProps) => {

    const [editing, set_editing] = useState(props.editing)
    const [dirty, set_dirty] = useState(false)
    const [title, set_title] = useState(props.title)

    return (
        <React.Fragment>
            {(props.edit && !editing) && <IconButton icon={<Icon icon="close" />} circle size="xs" />}
            {editing &&
            <Grid fluid>
                <Row>
                    <Col xs={12}><span><Input size="xs" defaultValue={props.title} onChange={(v: string) => set_title(v)} /></span></Col>
                    <Col xs={3}><Button className="ml-2" size="xs" onClick={(ev) => {ev.preventDefault(); if(props.onUpdate && title){ props.onUpdate({title})} set_dirty(true); set_editing(false);}}>{t`Update`}</Button></Col>
                    <Col xs={4}><Button className="ml-2" size="xs" onClick={(ev) => {ev.preventDefault();  if(props.onCancel){ props.onCancel()} set_editing(false) }}>{t`Cancel`}</Button></Col>
                </Row>
            </Grid>
            }
            {!editing && <span>{props.title}</span>}
            {(props.edit && !editing) && <Button className="ml-2" size="xs" onClick={(ev) => {ev.preventDefault(); set_dirty(true); set_editing(true) }}>{t`Edit`}</Button>}
        </React.Fragment>
    )
}

interface CommissionGuidelineList {
    type: string
    edit?: boolean
    bordered?: boolean
    new?: boolean
    name?: string
    options?: Array<string>
}

export const CommissionGuidelineList = (props: CommissionGuidelineList) => {

    const [new_option, set_new_option] = useState(false)
    const store = useCommissionRateStore()
    const user = useUser()
    const options = props.options ? props.options : store.state.options.map(({_id}) => _id)

    return (
        <List className="" bordered={props.bordered}>
            <FormControl name={props.name || "extras"} accepter={CheckboxGroup}>
            {
            store.state.options.filter(({_id}) => options.includes(_id)).map(({title, price, _id},index) => {
                let opt = <CommissionGuidelineText edit={props.edit} title={title} onUpdate={(v) => log.info(v)}/>
                return (
                    <List.Item key={_id} index={index}>
                        {opt}
                    </List.Item>
                )
            })
            }
            {new_option && <List.Item><CommissionGuidelineText edit={true} editing={true} title="" onUpdate={(v) => {store.create_option({user:user._id, ...v}); set_new_option(false)}} onCancel={() => {set_new_option(false) }}/></List.Item>}
            {(props.new && !new_option) && <List.Item><Button size="sm" className="ml-5 pl-5" onClick={(ev) => {ev.preventDefault(); set_new_option(true) }}>{t`Add new option`}</Button></List.Item>}
            </FormControl>
        </List>
    )
}

const CommissionGuidelineForm = () => {
    return (
        <div>
            
        </div>
    );
};

export default CommissionGuidelineForm;