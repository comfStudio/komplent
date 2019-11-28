import React from 'react'
import { Grid, Col, Row, Divider } from 'rsuite'

import { NavUserSidebar } from '@components/Header/NavUser'
import { Avatar } from '@components/Profile/ProfileHeader'
import { ProfileNameTag } from '@components/Profile'
import useUserStore from '@client/store/user'
import * as pages from '@utility/pages'

import { t } from '@app/utility/lang'

import './UserSidebar.scss'
import Link from 'next/link'
import { NoProfileContext } from '@client/context'

interface Props {
    activeKey?: string
}

const UserSidebar = (props: Props) => {
    const store = useUserStore()
    const user = store.state.current_user

    let active_comm_count = store.state.active_commissions_count

    if (user.type === 'consumer') {
        active_comm_count += store.state.active_requests_count
    }

    return (
        <NoProfileContext>
            <Grid fluid className="user-sidebar animate-width">
                <Row>
                    <Col xs={24} className="text-center">
                        <Avatar />
                    </Col>
                    <Col xs={24} className="text-center">
                        <ProfileNameTag name={user.name || user.username} />
                    </Col>
                </Row>
                <Row>
                    <Col
                        xs={user.type === 'creator' ? 12 : 24}
                        className="text-center stat-info">
                        <Link href={pages.commissions}>
                            <a className="unstyled">
                                <strong className="text-primary">
                                    {active_comm_count}
                                </strong>
                                <small>{t`Commissions`}</small>
                            </a>
                        </Link>
                    </Col>
                    {user.type === 'creator' && (
                        <Col xs={12} className="text-center stat-info">
                            <Link href={pages.commission_requests}>
                                <a className="unstyled">
                                    <strong className="text-primary">
                                        {store.state.active_requests_count}
                                    </strong>
                                    <small>{t`Requests`}</small>
                                </a>
                            </Link>
                        </Col>
                    )}
                </Row>
                <hr />
                <Row>
                    <Col xs={24}>
                        <NavUserSidebar activeKey={props.activeKey} />
                    </Col>
                </Row>
            </Grid>
        </NoProfileContext>
    )
}

export default UserSidebar
