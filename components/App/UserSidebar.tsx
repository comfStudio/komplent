import React from 'react';
import { Grid, Col, Row, Divider } from 'rsuite';

import {NavUserSidebar} from '@components/Header/NavUser'
import { Avatar } from '@components/Profile/ProfileHeader'
import { ProfileNameTag } from '@components/Profile'

import { t } from '@app/utility/lang'

import './UserSidebar.scss'

interface Props {
    activeKey?: string
}

const UserSidebar = (props: Props) => {
    return (
        <Grid fluid className="user-sidebar">
            <Row>
                <Col xs={24} className="text-center">
                    <Avatar/>
                </Col>
                <Col xs={24} className="text-center">
                    <ProfileNameTag/>
                </Col>
            </Row>
            <Row>
                <Col xs={12} className="text-center stat-info">
                    <strong>3</strong>
                    <small>{t`Commissions`}</small>
                </Col>
                <Col xs={12} className="text-center stat-info">
                    <strong>30</strong>
                    <small>{t`Requests`}</small>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col xs={24}>
                    <NavUserSidebar activeKey={props.activeKey}/>
                </Col>
            </Row>
        </Grid>
    );
};

export default UserSidebar;