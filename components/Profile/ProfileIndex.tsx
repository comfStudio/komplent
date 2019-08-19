import React, { Component } from 'react';

import { Card, Skeleton, Col, Row, Typography } from 'rsuite'

import { CommissionCard } from '@components/Profile/Commission'

const {Title} = Typography

import { t } from '@app/utility/lang'

export class ProfileIndex extends Component {
    render() {
        return (
            <div>
                <Title level={3}>{t`Commission Rates`}</Title>
                <Row gutter={16}>
                    <Col span={6}>
                        <CommissionCard/>
                    </Col>
                    <Col span={6}>
                    <CommissionCard/>
                    </Col>
                    <Col span={6}>
                    <CommissionCard/>
                    </Col>
                    <Col span={6}>
                    <CommissionCard/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ProfileIndex;