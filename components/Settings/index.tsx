import React from 'react'
import {
    Grid,
    Row,
    Col,
    Checkbox,
    CheckboxGroup,
    FormGroup,
    ControlLabel,
    Button,
    RadioGroup,
    Radio,
    TagPicker,
    List,
    SelectPicker,
    InputNumber,
} from 'rsuite'
import classnames from 'classnames'

import './Settings.scss'
import { t } from '@app/utility/lang'
import { ReactProps, HTMLElementProps } from '@utility/props'
import MainLayout from '@components/App/MainLayout'
import SettingsMenu from './SettingsMenu'

interface EditFroupProps extends ReactProps, HTMLElementProps {
    title?: string
    margin?: boolean
}

export const EditGroup = (props: EditFroupProps) => {
    return (
        <FormGroup className={classnames("edit-group", props.className)}>
            {!!props.title && (
                <ControlLabel className={classnames({"!mb-4 block": props.margin})}>{props.title}</ControlLabel>
            )}
            {props.children}
        </FormGroup>
    )
}

export const EditSection = (props: ReactProps & HTMLElementProps) => {
    return <div className={classnames("edit-section", props.className)}>{props.children}</div>
}

interface Props extends ReactProps {
    activeKey?: string
}

const SettingsLayout = (props: Props) => {
    return (
        <MainLayout
            activeKey="settings"
            paddedTop
            header={<SettingsMenu activeKey={props.activeKey} />}>
            {props.children}
        </MainLayout>
    )
}

export default SettingsLayout
