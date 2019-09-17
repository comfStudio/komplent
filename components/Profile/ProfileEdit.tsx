import React from 'react';
import { Grid, Form, Checkbox, CheckboxGroup, FormGroup, ControlLabel } from 'rsuite';
import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props';

import './ProfileEdit.scss'


const EditGroup = (props: ReactProps) => {
    return (<FormGroup className="edit-group">{props.children}</FormGroup>)
}

const EditSection = (props: ReactProps) => {
    return (<div className="edit-section">{props.children}</div>)
}

export const Sections = () => {
    return (
        <EditGroup>
            <ControlLabel>{t`Sections`}</ControlLabel>
            <CheckboxGroup inline name="sections">
            <Checkbox checked disabled>{t`About`}</Checkbox>
            <Checkbox checked disabled>{t`Rates`}</Checkbox>
            <Checkbox>{t`Reviews`}</Checkbox>
            <Checkbox>{t`Gallery`}</Checkbox>
            <Checkbox>{t`Shop`}</Checkbox>
            </CheckboxGroup>
        </EditGroup>
    )
}

export const ProfileEdit = () => {
    return (
        <Grid fluid>
            <h4>{t`General`}</h4>
            <EditSection>
                <Sections/>
                <Sections/>
            </EditSection>
            <h4>{t`Commission Rates`}</h4>
        </Grid>
    );
};

export default ProfileEdit;