import React, { Component } from 'react'
import { Panel, Button, Grid, Row, Col, FlexboxGrid, ButtonToolbar, IconButton, Icon } from 'rsuite'
import Link from 'next/link'

import Image from '@components/App/Image'
import { t } from '@app/utility/lang'
import { HTMLElementProps } from '@app/utility/props'

import './UserCard.scss'
import {
    make_profile_urlpath,
    make_commission_rate_urlpath,
} from '@utility/pages'
import { get_profile_name, get_profile_avatar_url } from '@utility/misc'

interface Props extends HTMLElementProps {
    data: any
    fluid?: boolean
}

export const UserCard = ({ fluid = true, ...props }: Props) => {

    const el = (
        <Grid fluid>
            <Row className="mb-1">
                <Col xs={4}>
                    <div className="avatar">
                        <Image w={80} h={80} src={get_profile_avatar_url(props.data)} />
                    </div>
                </Col>
                <Col xs={20}>
                    <Row>
                        <Col xs={24} className="name">
                            {get_profile_name(props.data)} <span className="muted text-sm">(@{props.data.username})</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} className="buttons">
                            <ButtonToolbar>
                                <IconButton appearance="ghost" icon={<Icon icon="envelope"/>} size="sm">{t`Send Message`}</IconButton>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Grid>
    )

    return (
        <Panel bordered bodyFill className={`user-card ${fluid && 'w-full'}`}>
            {props.data.type === 'creator' &&
            <Link href={make_profile_urlpath(props.data)}>
                <a className="unstyled">
                    {el}
                </a>
            </Link>
            }
            {props.data.type !== 'creator' && el}
        </Panel>
    )
}

export default UserCard