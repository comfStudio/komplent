import React from 'react'
import Link from 'next/link'
import { List, Grid, Row, Col, Divider, Tag } from 'rsuite'

import { useCommissionsStore } from '@client/store/commission'
import { t } from '@utility/lang'
import { useUser } from '@hooks/user'
import * as pages from '@utility/pages'

interface CommissionItemProps {
    data: any
}

const CommissionItem = (props: CommissionItemProps) => {
    const user = useUser()
    const title =
        user._id == props.data.from_user._id
            ? props.data.from_title
            : props.data.to_title
            ? props.data.to_title
            : props.data.from_title

    return (
        <Link href={pages.make_commission_urlpath({ _id: props.data._id })}>
            <a className="unstyled">
                <List.Item>
                    {title}
                    <span className="float-right">
                        {!props.data.finished && !props.data.accepted && (
                            <Tag color="orange">{t`On-hold`}</Tag>
                        )}
                        {!props.data.finished && props.data.accepted && (
                            <Tag color="orange">{t`On-going`}</Tag>
                        )}
                        {props.data.finished && props.data.completed && (
                            <Tag color="green">{t`Completed`}</Tag>
                        )}
                        {props.data.finished && !props.data.completed && (
                            <Tag color="red">{t`Unsuccessful`}</Tag>
                        )}
                        {props.data.finished &&
                            !props.data.completed &&
                            props.data.expire_date && (
                                <Tag color="yellow">{t`Expired`}</Tag>
                            )}
                    </span>
                </List.Item>
            </a>
        </Link>
    )
}

export const RequestListing = () => {
    const user = useUser()
    const store = useCommissionsStore()

    return (
        <Grid fluid className="mt-5">
            <Row>
                <Col xs={24}>
                    <List hover bordered>
                        {store.state.commissions
                            .filter(
                                ({ to_user, accepted }) =>
                                    to_user._id === user._id && !accepted
                            )
                            .map(d => {
                                return <CommissionItem key={d._id} data={d} />
                            })}
                    </List>
                </Col>
            </Row>
        </Grid>
    )
}

export const CommissionsListing = () => {
    const user = useUser()
    const store = useCommissionsStore()

    const items = comms =>
        comms.map(d => {
            return <CommissionItem key={d._id} data={d} />
        })

    const sort_by_title = (a, b) => {
        let nameA = store.get_title(user._id, a).toUpperCase() // ignore upper and lowercase
        let nameB = store.get_title(user._id, b).toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
            return -1
        }
        if (nameA > nameB) {
            return 1
        }
        return 0
    }

    let to_comms = store.received_commissions(user._id)
    let from_comms = store.sent_commissions(user._id)

    let past_to_comms = to_comms.filter(d => d.finished)
    let past_from_comms = from_comms.filter(d => d.finished)

    to_comms = to_comms.filter(d => !d.finished)
    from_comms = from_comms.filter(d => !d.finished)

    to_comms.sort(sort_by_title)
    from_comms.sort(sort_by_title)

    return (
        <Grid fluid>
            <Row>
                <h4>{t`Commissions started by you`}</h4>
                <Col xs={24}>
                    <List hover bordered>
                        {items(from_comms)}
                    </List>
                </Col>
            </Row>
            {user.type === 'creator' && (
                <Row>
                    <h4>{t`On-going commissions`}</h4>
                    <Col xs={24}>
                        <List hover bordered>
                            {items(to_comms)}
                        </List>
                    </Col>
                </Row>
            )}
            <Row>
                <h4>{t`Past commissions`}</h4>
                <Col xs={24}>
                    {user.type === 'creator' && (
                        <Divider className="!mt-2">{t`Sent`}</Divider>
                    )}
                    <List hover bordered>
                        {items(past_from_comms)}
                    </List>
                    {user.type === 'creator' && (
                        <Divider>{t`Received`}</Divider>
                    )}
                    {user.type === 'creator' && (
                        <List hover bordered>
                            {items(past_to_comms)}
                        </List>
                    )}
                </Col>
            </Row>
        </Grid>
    )
}

export default CommissionsListing
