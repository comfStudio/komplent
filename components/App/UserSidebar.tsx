import React from 'react';
import { Grid, Col, Row, Divider } from 'rsuite';

import {NavUserSidebar} from '@components/Header/NavUser'
import { Avatar } from '@components/Profile/ProfileHeader'
import { ProfileNameTag } from '@components/Profile'
import useUserStore from '@store/user';

import { t } from '@app/utility/lang'

import './UserSidebar.scss'

interface Props {
    activeKey?: string
}

const UserSidebar = (props: Props) => {
    const [state, actions] = useUserStore()
    const user = state.current_user
    return (
        <Grid fluid className="user-sidebar animate-width">
            <Row>
                <Col xs={24} className="text-center">
                    <Avatar/>
                </Col>
                <Col xs={24} className="text-center">
                    <ProfileNameTag name={user.name || user.username}/>
                </Col>
            </Row>
            <Row>
                <Col xs={12} className="text-center stat-info">
                    <strong className="text-primary">{state.active_commissions_count}</strong>
                    <small>{t`Commissions`}</small>
                </Col>
                <Col xs={12} className="text-center stat-info">
                    <strong className="text-primary">{state.active_requests_count}</strong>
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