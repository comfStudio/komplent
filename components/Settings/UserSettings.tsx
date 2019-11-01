import React from 'react';
import { Grid, RadioGroup, Radio, SelectPicker, Button } from 'rsuite';
import { EditGroup, EditSection } from '.';

import { t } from '@app/utility/lang'

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

const UserSettings = () => {
    return (
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
            <Button appearance="ghost" color="red">{t`Delete account`}</Button>
        </EditSection>
    </Grid>
    );
};

export default UserSettings;