import React, { Component } from 'react';
import { Button, Panel, Row, Col, Grid, Input, Form } from 'rsuite'

import Link from 'next/link'

import { t } from '@app/utility/lang'
import { HTMLElementProps, ReactProps } from '@utility/props'

import './ProfileCommission.scss'

export const CommissionButton = (props: HTMLElementProps) => {
    let cls = "commission-button"
    return (
        <Link href="profile/commission">
            <Button appearance="primary" size="lg" className={props.className ? cls + ' ' + props.className : cls}>
                {t`Request a Commission`}
            </Button>
        </Link>
    );
};

export const SendRequestButton = (props: HTMLElementProps) => {
    let cls = "commission-button"
    return (
        <Button type="submit" appearance="primary" size="lg" className={props.className ? cls + ' ' + props.className : cls}>
            {t`Send request`}
        </Button>
    );
};

interface CommissionCardProps extends HTMLElementProps {
    title?: string
}

const CommissionCardHeader = (props) => {
    return <h4>{props.children}</h4>
}

export const CommissionCard = (props: CommissionCardProps) => {
    let cls = "commission-card mx-auto"
    return (
        <Panel bodyFill header={<CommissionCardHeader>{props.title}</CommissionCardHeader>} className={props.className ? cls + ' ' + props.className : cls} bordered>
        </Panel>
    );
};

export const CommissionTiers = (props: any) => {
    return (
    <Row gutter={16}>
        <Col xs={6}>
            <CommissionCard title="$15"/>
        </Col>
        <Col xs={6}>
            <CommissionCard title="$25"/>
        </Col>
        <Col xs={6}>
            <CommissionCard title="$35"/>
        </Col>
        <Col xs={6}>
            <CommissionCard title="$55"/>
        </Col>
    </Row>)
}

export class ProfileCommission extends Component {
    render() {
        return (
            <Form>
                <Grid fluid>
                    <h4>{t`Commission Rates`}</h4>
                    <CommissionTiers/>
                    <hr/>
                    <Row>
                        <Col xs={24}>
                        <Input
                            componentClass="textarea"
                            rows={3}
                            placeholder={t`Describe your request`}
                            />
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={4} xsPush={20}><SendRequestButton/></Col>
                    </Row>
                </Grid>
            </Form>
        );
    }
}

export default ProfileCommission;