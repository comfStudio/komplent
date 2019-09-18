import React from 'react';
import { Grid, Row, Col, Checkbox, CheckboxGroup, FormGroup, ControlLabel, Button, RadioGroup, Radio, TagPicker, List, SelectPicker, InputNumber } from 'rsuite';


import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props';
import MainLayout from '@components/App/MainLayout'

interface EditFroupProps extends ReactProps {
    title?: string
}

export const EditGroup = (props: EditFroupProps) => {
    return (
    <FormGroup className="edit-group">
        { !!props.title && <ControlLabel className="">{props.title}</ControlLabel>}
        {props.children}
    </FormGroup>
    )
}

export const EditSection = (props: ReactProps) => {
    return (<div className="edit-section">{props.children}</div>)
}

export const UserType = () => {
    return (
        <EditGroup>
            <span className="mr-2">{t`Type of user`}: </span>
            <RadioGroup name="user_type" inline appearance="picker" defaultValue="consumer">
            <Radio value="consumer">{t`Consumer`}</Radio>
            <Radio value="creator">{t`Creator`}</Radio>
            </RadioGroup>
        </EditGroup>
    )
}

export const Theme = () => {
    return (
        <EditGroup>
            <span className="mr-2">{t`Theme`}: </span>
            <RadioGroup name="user_type" inline appearance="picker" defaultValue="light">
            <Radio value="light">{t`Light`}</Radio>
            <Radio value="dark">{t`Dark`}</Radio>
            </RadioGroup>
        </EditGroup>
    )
}


export const Currency = () => {
    return (
    <EditGroup title={t`Currency` + ':'}>
        <SelectPicker data={[]} className="ml-2" style={{ width: 300 }}/>
    </EditGroup>
    )
}

export const Location = () => {
    return (
    <EditGroup title={t`Location` + ':'}>
        <SelectPicker data={[]} className="ml-2" style={{ width: 300 }}/>
    </EditGroup>
    )
}

const SettingsLayout = () => {
    return (
        <MainLayout activeKey="settings">
             <Grid fluid>
                <h4>{t`General`}</h4>
                <EditSection>
                    <Currency/>
                    <Location/>
                </EditSection>
                <h4>{t`Site`}</h4>
                <EditSection>
                    <Theme/>
                </EditSection>
                <h4>{t`Links`}</h4>
                <EditSection>
                </EditSection>
                <h4>{t`Account`}</h4>
                <EditSection>
                    <UserType/>
                    <Button color="ghost">{t`Delete account`}</Button>
                </EditSection>
            </Grid>
        </MainLayout>
    );
};

export default SettingsLayout;