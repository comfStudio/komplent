import React, { useReducer } from 'react'
import Link from 'next/link'
import { List, Grid, Row, Col, Divider, Tag, ButtonToolbar, ButtonGroup, Button, PanelGroup } from 'rsuite'
import { useRouter } from 'next/router'
import qs from 'qs'

import { useCommissionsStore } from '@client/store/commission'
import * as pages from '@utility/pages'
import { t } from '@utility/lang'
import { useUser } from '@hooks/user'
import { ReactProps } from '@utility/props'
import { CommissionItemPanelProps, CommissionItemPanel } from '@components/Commission'
import { EmptyPanel } from '@components/App/Empty'

const CommissionListItem = (props: CommissionItemPanelProps) => {
    return (
        <List.Item className="!p-0">
            <CommissionItemPanel {...props}/>
        </List.Item>
    )
}

interface CommissionListProps extends ReactProps {
    data: any[]
}

export const CommissionList = (props: CommissionListProps) => {

    const user = useUser()
    const store = useCommissionsStore()

    return (
        <List hover bordered>
            {!props.data.length && <EmptyPanel type="blank_canvas"/>}
            {props.data.map(d => <CommissionListItem key={d._id} data={d} />)}
        </List>
    )
}

export const RequestListing = () => {
    const user = useUser()
    const store = useCommissionsStore()
    const router = useRouter()
    const btn_state = {
        all: false,
        active: router.query.active === 'true',
        rejected: router.query.rejected === 'true',
        expired: router.query.expired === 'true',
    }
    
    if (!Object.values(btn_state).some(Boolean)) {
        btn_state.all = router.query.all ? router.query.all === 'true' : true
    }

    return (
        <Grid fluid className="mt-5">
            <Row>
            <ButtonToolbar className="clearfix">
                    <ButtonGroup className="float-right">
                        <Link  href={pages.commission_requests + '?' + qs.stringify({ type:router.query.type, all: true })} passHref>
                            <Button active={btn_state.all} componentClass="a">{t`All`}</Button>
                        </Link>
                        <Link href={pages.commission_requests + '?' + qs.stringify({ type:router.query.type, active: (!btn_state.active).toString() })} passHref>
                            <Button active={btn_state.active} componentClass="a">{t`Active`}</Button>
                        </Link>
                        <Link href={pages.commission_requests + '?' + qs.stringify({ type:router.query.type, rejected: (!btn_state.rejected).toString() })} passHref>
                            <Button active={btn_state.rejected} componentClass="a">{t`Rejected`}</Button>
                        </Link>
                        <Link href={pages.commission_requests + '?' + qs.stringify({ type:router.query.type, expired: (!btn_state.expired).toString() })} passHref>
                            <Button active={btn_state.expired} componentClass="a">{t`Expired`}</Button>
                        </Link>
                    </ButtonGroup>
                </ButtonToolbar>
                <Divider className="!mt-2"></Divider>
                <Col xs={24}>
                    <CommissionList data={store.state.commissions}/>
                </Col>
            </Row>
        </Grid>
    )
}

interface CommissionsListingProps {
    listtype?: 'received'|'sent'
}

export const CommissionsListing = (props: CommissionsListingProps) => {
    const user = useUser()
    const store = useCommissionsStore()
    const router = useRouter()
    const btn_state = {
        all: false,
        ongoing: router.query.ongoing === 'true',
        completed: router.query.completed === 'true',
        failed: router.query.failed === 'true',
        rejected: router.query.rejected === 'true',
        expired: router.query.expired === 'true',
    }
    
    if (!Object.values(btn_state).some(Boolean)) {
        btn_state.all = router.query.all ? router.query.all === 'true' : true
    }

    return (
        <Grid fluid>
            <Row>
                <ButtonToolbar className="clearfix">
                    {user?.type === 'creator' &&
                    <ButtonGroup>
                        <Link href={pages.commissions + '?' + qs.stringify({ type: "received" })} passHref>
                            <Button active={props.listtype === 'received'} componentClass="a">{t`Received`}</Button>
                        </Link>
                        <Link href={pages.commissions + '?' + qs.stringify({ type: "sent" })} passHref>
                            <Button active={props.listtype === 'sent'} componentClass="a">{t`Sent`}</Button>
                        </Link>
                    </ButtonGroup>
                    }
                    <ButtonGroup className="float-right">
                        <Link  href={pages.commissions + '?' + qs.stringify({ type:router.query.type, all: true })} passHref>
                            <Button active={btn_state.all} componentClass="a">{t`All`}</Button>
                        </Link>
                        <Link href={pages.commissions + '?' + qs.stringify({ type:router.query.type, ongoing: (!btn_state.ongoing).toString() })} passHref>
                            <Button active={btn_state.ongoing} componentClass="a">{t`On-going`}</Button>
                        </Link>
                        <Link href={pages.commissions + '?' + qs.stringify({ type:router.query.type, completed: (!btn_state.completed).toString() })} passHref>
                            <Button active={btn_state.completed} componentClass="a">{t`Completed`}</Button>
                        </Link>
                        {user?.type !== 'creator' &&
                        <Link href={pages.commissions + '?' + qs.stringify({ type:router.query.type, rejected: (!btn_state.rejected).toString() })} passHref>
                            <Button active={btn_state.rejected} componentClass="a">{t`Rejected`}</Button>
                        </Link>
                        }
                        <Link href={pages.commissions + '?' + qs.stringify({ type:router.query.type, failed: (!btn_state.failed).toString() })} passHref>
                            <Button active={btn_state.failed} componentClass="a">{t`Failed`}</Button>
                        </Link>
                        <Link href={pages.commissions + '?' + qs.stringify({ type:router.query.type, expired: (!btn_state.expired).toString() })} passHref>
                            <Button active={btn_state.expired} componentClass="a">{t`Expired`}</Button>
                        </Link>
                    </ButtonGroup>
                </ButtonToolbar>
                <Divider className="!mt-2"></Divider>
                <Col xs={24}>
                    <CommissionList data={store.state.commissions}/>
                </Col>
            </Row>
        </Grid>
    )
}

export default CommissionsListing
