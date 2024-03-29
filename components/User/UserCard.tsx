import React, { Component, memo } from 'react'
import { Panel, Button, Grid, Row, Col, FlexboxGrid, ButtonToolbar, IconButton, Icon, Whisper, Tooltip } from 'rsuite'
import Link from 'next/link'
import classnames from 'classnames'
import { PanelProps } from 'rsuite/lib/Panel'

import Image from '@components/App/Image'
import { t } from '@app/utility/lang'
import { HTMLElementProps } from '@app/utility/props'

import './UserCard.scss'
import {
    make_profile_urlpath,
    make_commission_rate_urlpath,
} from '@utility/pages'
import { get_profile_name, get_profile_avatar_url } from '@utility/misc'
import Tag, { TagProps } from 'rsuite/lib/Tag'

export const CommissionBadge = memo(function CommissionBadge({data = undefined, color=undefined, ...props}: {data: any} & TagProps) {

    if (!data || data?.count === 0) {
        return null
    }

    let text = t`Known`
    let tooltip = t`This client has requested a commission before`

    if (data?.count > 0) {
        if (data?.count < 3) {
            text = t`Regular`
            color="green"
            tooltip = t`This client has regularly requested commissions`
        } else if (data?.count < 6) {
            text = t`Mega Regular`
            color="blue"
            tooltip = t`This client has regularly requested commissions`
        } else {
            text = t`Super Regular`
            color="violet"
            tooltip = t`This client has requested alot of commissions from you!`
        }

    }

    return (
        <Whisper preventOverflow placement="top" trigger="hover" speaker={<Tooltip>{tooltip}</Tooltip>}>
            <Tag color={color} {...props}>
                {text}
            </Tag>
        </Whisper>
    )
})

interface Props extends HTMLElementProps, PanelProps {
    data: any
    fluid?: boolean
    horizontal?: boolean
    small?: boolean
    noLink?: boolean
    childrenRight?: boolean
    commissionCountData?: any
    noMessageButton?: boolean
}

export const UserCard = memo(function UserCard({ fluid = true, bordered = true, bodyFill = true, ...props }: Props) {

    const avatar_el = <div className={classnames("avatar", {small: props.small})}>
                        <Image w={props.small ? 40 : 80} h={props.small ? 40 : 80} src={get_profile_avatar_url(props.data)} />
                    </div>

    const name_el = <>
        {get_profile_name(props.data)} <span className="muted text-sm">(@{props.data.username})</span>
        <CommissionBadge data={props?.commissionCountData?.[props.data._id]} className="ml-2"/>
        </>

    const buttons_el = <ButtonToolbar className="mt-auto mb-auto pl-2 flex content-center justify-center">
                            {!props.noMessageButton && <IconButton appearance="ghost" icon={<Icon icon="envelope"/>} size={props.small ? "xs" : "sm"}>{t`Send Message`}</IconButton>}
                        </ButtonToolbar>

    let el

    if (props.horizontal) {
        el = <div className="flex">
            <span>{avatar_el}</span>
            <span className="flex ml-2 flex-1 content-center justify-center">
                <span className="mt-auto mb-auto">
                    {name_el}
                </span>
                {!props.childrenRight && <span className="flex-1 pl-2 mt-auto mb-auto">{props.children}</span>}
                {props.childrenRight && buttons_el}
                {props.childrenRight && <span className="flex-1 mt-auto mb-auto">{props.children}</span>}
                {!props.childrenRight && buttons_el}
            </span>
        </div>
    } else {
        el = (
            <Grid fluid>
                <Row className="mb-1">
                    <Col xs={4}>
                        {avatar_el}
                    </Col>
                    <Col xs={20}>
                        <Row>
                            <Col xs={24} className="name">
                                {name_el}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} className="buttons">
                                {buttons_el}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Grid>
        )
    }

    return (
        <Panel bordered = {bordered} bodyFill={bodyFill} className={classnames("user-card", {'w-full': fluid, horizontal: props.horizontal}, props.className)} {...props}>
            {props.data.type === 'creator' && !props.noLink &&
            <Link href={make_profile_urlpath(props.data)}>
                <a className="unstyled">
                    {el}
                </a>
            </Link>
            }
            {(props.data.type !== 'creator' || props.noLink) && el}
        </Panel>
    )
})

export default UserCard