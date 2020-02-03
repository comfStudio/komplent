import React from 'react'
import Panel, { PanelProps } from 'rsuite/lib/Panel'
import { TagProps } from 'rsuite/lib/Tag'
import { List, Grid, Row, Col, Divider, Tag, ButtonToolbar, ButtonGroup, Button, PanelGroup } from 'rsuite'
import Link from 'next/link'

import { get_profile_avatar_url, get_profile_name, price_is_null, decimal128ToMoneyToString } from '@utility/misc'
import Image from '@components/App/Image'
import { useUser } from '@hooks/user'
import { t } from '@utility/lang'
import * as pages from '@utility/pages'

import './Commission.scss'
import UserCard from '@components/User/UserCard'
import { formatDistanceToNow } from 'date-fns'

export interface CommissionItemPanelProps extends PanelProps {
    data: any
}

export const CommissionStatusTag = ({data, ...props}: {data: any} & TagProps) => {
    const user = useUser()
    const is_owner = user?._id === data.from_user?._id

    return (
        <>
        {!data.finished && !data.accepted && (
            <Tag color="violet" {...props}>{is_owner ? t`Waiting for approval` : t`Queued`}</Tag>
        )}
        {!data.finished && data.accepted && (
            <Tag color="blue" {...props}>{t`Active`}</Tag>
        )}
        {data.finished && data.completed && (
            <Tag color="green" {...props}>{t`Completed`}</Tag>
        )}
        {data.finished && !data.completed && (
            <Tag color="red" {...props}>{t`Unsuccessful`}</Tag>
        )}
        </>
    )
}

export const CommissionItemPanel = (props: CommissionItemPanelProps) => {
    const user = useUser()
    const title =
        user?._id === props.data.from_user._id
            ? props.data.from_title
            : props.data.to_title
            ? props.data.to_title
            : props.data.from_title

    const commission_user = user._id === props.data.to_user._id ? props.data.from_user : props.data.to_user

    const rate_price = price_is_null(props.data.rate.price) ? t`Custom price` : decimal128ToMoneyToString(props.data.rate.price)

    return (
        <Link href={pages.make_commission_urlpath({ _id: props.data._id })}>
            <a className="unstyled">
                <Panel className="commission-panel-item">
                    <div className="header flex content-center">
                        <Image className="avatar" w={40} h={40} src={get_profile_avatar_url(commission_user)} />
                        <span className="title mt-auto mb-auto flex-1">
                            {title}
                        </span>
                        <span className="muted">
                            {props.data.rate.title} • {rate_price} • {formatDistanceToNow(new Date(props.data.created), { addSuffix: true })}
                        </span>
                    </div>
                    <div className="flex content-center">
                        <span className="muted px-2 mt-1 inline-block">
                            ∟ {get_profile_name(commission_user)} <span className="muted text-sm">(@{commission_user.username})</span>
                        </span>
                        <span className="flex-1 text-center muted">
                        </span>
                        <span>
                            <CommissionStatusTag data={props.data}/>
                            {props.data.finished &&
                                !props.data.completed &&
                                props.data.expire_date && (
                                    <Tag color="orange">{t`Expired`}</Tag>
                                )}
                        </span>
                    </div>
                </Panel>
            </a>
        </Link>
    )
}
