import React from 'react';
import { Grid, Row, Col, Checkbox, CheckboxGroup, FormGroup, ControlLabel, Button } from 'rsuite';

import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props';
import { CommissionCard } from '@components/Profile/ProfileCommission';

import './ProfileEdit.scss'

interface EditFroupProps extends ReactProps {
    title?: string
}

const EditGroup = (props: EditFroupProps) => {
    return (
    <FormGroup className="edit-group">
        { !!props.title && <ControlLabel>{props.title}</ControlLabel>}
        {props.children}
    </FormGroup>
    )
}

const EditSection = (props: ReactProps) => {
    return (<div className="edit-section">{props.children}</div>)
}

export const Sections = () => {
    return (
        <EditGroup title={t`Sections`}>
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

export const Rates = () => {
    return (
        <React.Fragment>
            <Button appearance="ghost">{t`Add new rate`}</Button>
            <EditGroup>
                <Grid fluid>
                <Row gutter={16}>
                    <Col xs={5}>
                        <CommissionCard price={15} title="Sketch"/>
                    </Col>
                    <Col xs={5}>
                        <CommissionCard price={25} title="Colored Sketch"/>
                    </Col>
                    <Col xs={5}>
                        <CommissionCard price={30} title="Flat Color" selected/>
                    </Col>
                    <Col xs={5}>
                        <CommissionCard price={45} title="Full color"/>
                    </Col>
                </Row>
                </Grid>
            </EditGroup>
        </React.Fragment>
    )
}

export const ProfileEdit = () => {
    return (
        <Grid fluid>
            <h4>{t`General`}</h4>
            <EditSection>
                <Sections/>
            </EditSection>
            <h4>{t`Commission Rates`}</h4>
            <EditSection>
                <Rates/>
            </EditSection>
        </Grid>
    );
};

export default ProfileEdit;