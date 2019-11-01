import React from 'react';
import { Grid, Row, Col, Checkbox, CheckboxGroup, FormGroup, ControlLabel, Button, RadioGroup, Radio, TagPicker, List, SelectPicker, InputNumber } from 'rsuite';

import './Settings.scss'
import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props';
import MainLayout from '@components/App/MainLayout'
import SettingsMenu from './SettingsMenu';

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

interface Props extends ReactProps {
    activeKey?: string
}

const SettingsLayout = (props: Props) => {
    return (
        <MainLayout activeKey="settings" paddedTop header={<SettingsMenu activeKey={props.activeKey}/>}>
            {props.children}
        </MainLayout>
    );
};

export default SettingsLayout;