import React, { Component } from 'react';
import { Button, Panel, Row, Col, Grid, Input, Form, Uploader, Icon, Toggle } from 'rsuite'

import Link from 'next/link'

import { t } from '@app/utility/lang'
import { HTMLElementProps, ReactProps } from '@utility/props'

import './ProfileCommission.scss'
import Placeholder from '@components/App/Placeholder';
import Image from '@components/App/Image'
import { useProfileContext } from '@hooks/user';

export const CommissionButton = (props: HTMLElementProps) => {
    const { profile_path } = useProfileContext()
    let cls = "commission-button"
    return (
        <Link href={`${profile_path}/commission`}>
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
    price?: number
    selected?: boolean
}

const CommissionCardHeader = (props) => {
    return (<Grid className="header !w-full">
        <Row>
            <Col xs={8}>
                <span className="price">${props.price}</span>
            </Col>
            <Col xs={16}>
                <h4 className="title inline-block">{props.title}</h4>
            </Col>
        </Row>
        <Row className="extra-row">
            <Col xs={24}>
                    <small className="extra">+ ${props.price} - Potrait</small>
            </Col>
            <Col xs={24}>
                    <small className="extra">+ ${props.price} - Half body</small>
            </Col>
            <Col xs={24}>
                    <small className="extra">+ ${props.price} - Full body</small>
            </Col>
            <Col xs={24}>
                    <small className="extra">+ ${props.price} - Background</small>
            </Col>
        </Row>
    </Grid>)
}

export const CommissionCard = (props: CommissionCardProps) => {
    let cls = "commission-card mx-auto"
    if (props.selected)
        cls += " selected"
    return (
        <Panel bodyFill className={props.className ? cls + ' ' + props.className : cls} bordered>
            <CommissionCardHeader title={props.title} price={props.price}/>
            <Image w="100%" h={250}/>
            {props.selected && <span className="select-box">Selected</span>}
        </Panel>
    );
};

export const CommissionTiers = (props: any) => {
    return (
        <Row gutter={16}>
        <Col xs={6}>
            <CommissionCard price={15} title="Sketch"/>
        </Col>
        <Col xs={6}>
            <CommissionCard price={25} title="Colored Sketch"/>
        </Col>
        <Col xs={6}>
            <CommissionCard price={30} title="Flat Color" selected/>
        </Col>
        <Col xs={6}>
            <CommissionCard price={45} title="Full color"/>
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

export const ExtraToggle = (props: ReactProps) => {
    return (
        <span><Toggle/> {props.children}</span>
    );
};


export class ProfileCommission extends Component {
    render() {
        return (
            <Form>
                <Grid fluid>
                    <h3>{t`Pick your commission`}</h3>
                    <CommissionTiers/>
                    <hr/>
                    <Row>
                        <Placeholder type="text" rows={4}/>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={24}>
                            <ul className="extra-toggles">
                                <li><ExtraToggle>Potrait</ExtraToggle></li>
                                <li><ExtraToggle>Half Body</ExtraToggle></li>
                                <li><ExtraToggle>Full Body</ExtraToggle></li>
                                <li><ExtraToggle>Background</ExtraToggle></li>
                            </ul>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                        <h3>{t`Describe your commission request`}</h3>
                        <Input
                            componentClass="textarea"
                            rows={3}
                            placeholder={t`Describe your request`}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <h3>{t`Attachments`}</h3>
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