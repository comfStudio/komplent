import React, { Component } from 'react';
import { Button, Panel, Row, Col, Grid, Input, Form, Uploader, Icon, Toggle } from 'rsuite'

import Link from 'next/link'

import { t } from '@app/utility/lang'
import { HTMLElementProps, ReactProps } from '@utility/props'

import './ProfileCommission.scss'
import Placeholder from '@components/App/Placeholder';
import Image from '@components/App/Image'
import { useProfileContext } from '@hooks/user';
import { DrawingList } from '@app/components/Profile'
import useCommissionRateStore from '@store/commission';
import { decimal128ToFloat } from '@utility/misc';

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
    data: object
    selected?: boolean
}

const CommissionCardHeader = (props: CommissionCardProps) => {
    let { price, title, extras, negotiable } = props.data

    price = decimal128ToFloat(price)

    return (<Grid className="header !w-full">
        <Row>
            <Col xs={8}>
                <span className="price">${price}</span>
            </Col>
            <Col xs={16}>
                <h4 className="title inline-block">{title}</h4>
            </Col>
        </Row>
        {negotiable && 
        <Row>
            <Col xs={24} className="text-center">
                <span className="text-primary">{t`Negotiable`}</span>
            </Col>
        </Row>
        }
        <Row className="extra-row">
            {
            extras.map(({title: extra_title, price: extra_price, _id: extra_id},index) => (
                <Col key={extra_id} xs={24}>
                        <small className="extra">+ ${decimal128ToFloat(extra_price)} - {extra_title}</small>
                </Col>
    )       )
            }
        </Row>
    </Grid>)
}

export const CommissionCard = (props: CommissionCardProps) => {
    let cls = "commission-card mx-auto"
    if (props.selected)
        cls += " selected"
    return (
        <Panel bodyFill className={props.className ? cls + ' ' + props.className : cls} bordered>
            <CommissionCardHeader {...props}/>
            <Image w="100%" h={250}/>
            {props.selected && <span className="select-box">Selected</span>}
        </Panel>
    );
};

export const CommissionTiersRow = (props: any) => {

    const [state, actions] = useCommissionRateStore()
    return (
        <Row gutter={16}>
            {
                state.rates.map((data ,index) => {
                    let el = (
                        <Col key={data._id} xs={6}>
                            <CommissionCard data={data}/>
                        </Col>
                    )
                    return el
                })
            }
        </Row>
    )
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
                    <Row>
                        <Placeholder type="text" rows={4}/>
                    </Row>
                    <hr/>
                    <h3>{t`Pick your commission`}</h3>
                    <CommissionTiersRow/>
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
                    <hr/>
                    <Row>
                        <DrawingList/>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={24}>
                        <h3>{t`Describe your request`}</h3>
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
                    <Row>
                        <h3>{t`Terms of Service`}</h3>
                        <Placeholder type="text" rows={4}/>
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