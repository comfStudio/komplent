import React, { Component } from 'react';
import { Button, Panel, Row, Col, Grid, Input, Form, Uploader, Icon } from 'rsuite'

import Link from 'next/link'

import { t } from '@app/utility/lang'
import { HTMLElementProps, ReactProps } from '@utility/props'

import './ProfileCommission.scss'
import Placeholder from '../App/Placeholder';

export const CommissionButton = (props: HTMLElementProps) => {
    let cls = "commission-button"
    return (
        <Link href="/profile/commission">
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

const Attachments = (props) => {
    const fileList = [
        {
          name: 'a.png',
          fileKey: 1,
          url:
            'https://user-images.githubusercontent.com/1203827/47638792-92414e00-db9a-11e8-89c2-f8f430a23cd3.png'
        },
        {
          name: 'b.png',
          fileKey: 2,
          url:
            'https://user-images.githubusercontent.com/1203827/47638807-9d947980-db9a-11e8-9ee5-e0cc9cd7e8ad.png'
        }
      ];

    return (
        <Uploader listType="picture" defaultFileList={fileList} action="//jsonplaceholder.typicode.com/posts/">
            <button>
                <Icon icon='camera-retro' size="lg" />
            </button>
        </Uploader>
    )
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
                        <Placeholder type="text" rows={4}/>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={24}>
                        <h3>{`Describe your commission request`}</h3>
                        <Input
                            componentClass="textarea"
                            rows={3}
                            placeholder={t`Describe your request`}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <h3>{`Attachments`}</h3>
                        <Attachments/>
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