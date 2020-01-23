import React, { useReducer, memo } from 'react'
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
import { ToggleButton } from '@components/App/Misc'

const CommissionListItem = memo(function CommissionListItem(props: CommissionItemPanelProps) {
    return (
        <List.Item className="!p-0">
            <CommissionItemPanel {...props}/>
        </List.Item>
    )
})

interface CommissionListProps extends ReactProps {
    data: any[]
}

export const CommissionList = memo(function CommissionList(props: CommissionListProps) {

    const user = useUser()
    const store = useCommissionsStore()

    return (
        <List hover bordered>
            {!props.data.length && <EmptyPanel type="blank_canvas"/>}
            {props.data.map(d => <CommissionListItem key={d._id} data={d} />)}
        </List>
    )
})

export const RequestListing = memo(function RequestListing() {
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
                            <ToggleButton active={btn_state.all} componentClass="a">{t`All`}</ToggleButton>
                        </Link>
                        <Link href={pages.commission_requests + '?' + qs.stringify({ type:router.query.type, active: (!btn_state.active).toString() })} passHref>
                            <ToggleButton active={btn_state.active} componentClass="a">{t`Queued`}</ToggleButton>
                        </Link>
                        <Link href={pages.commission_requests + '?' + qs.stringify({ type:router.query.type, rejected: (!btn_state.rejected).toString() })} passHref>
                            <ToggleButton active={btn_state.rejected} componentClass="a">{t`Rejected`}</ToggleButton>
                        </Link>
                        <Link href={pages.commission_requests + '?' + qs.stringify({ type:router.query.type, expired: (!btn_state.expired).toString() })} passHref>
                            <ToggleButton active={btn_state.expired} componentClass="a">{t`Expired`}</ToggleButton>
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
})

interface CommissionsListingProps {
    listtype?: 'received'|'sent'
}

export const CommissionsListing = memo(function CommissionsListing(props: CommissionsListingProps) {
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
                            <ToggleButton active={props.listtype === 'received'} componentClass="a">{t`Received`}</ToggleButton>
                        </Link>
                        <Link href={pages.commissions + '?' + qs.stringify({ type: "sent" })} passHref>
                            <ToggleButton active={props.listtype === 'sent'} componentClass="a">{t`Sent`}</ToggleButton>
                        </Link>
                    </ButtonGroup>
                    }
                    <ButtonGroup className="float-right">
                        <Link  href={pages.commissions + '?' + qs.stringify({ type:router.query.type, all: true })} passHref>
                            <ToggleButton  active={btn_state.all} componentClass="a">{t`All`}</ToggleButton>
                        </Link>
                        <Link href={pages.commissions + '?' + qs.stringify({ type:router.query.type, ongoing: (!btn_state.ongoing).toString() })} passHref>
                            <ToggleButton active={btn_state.ongoing} componentClass="a">{t`Active`}</ToggleButton>
                        </Link>
                        <Link href={pages.commissions + '?' + qs.stringify({ type:router.query.type, completed: (!btn_state.completed).toString() })} passHref>
                            <ToggleButton active={btn_state.completed} componentClass="a">{t`Completed`}</ToggleButton>
                        </Link>
                        {user?.type !== 'creator' &&
                        <Link href={pages.commissions + '?' + qs.stringify({ type:router.query.type, rejected: (!btn_state.rejected).toString() })} passHref>
                            <ToggleButton active={btn_state.rejected} componentClass="a">{t`Rejected`}</ToggleButton>
                        </Link>
                        }
                        <Link href={pages.commissions + '?' + qs.stringify({ type:router.query.type, failed: (!btn_state.failed).toString() })} passHref>
                            <ToggleButton active={btn_state.failed} componentClass="a">{t`Failed`}</ToggleButton>
                        </Link>
                        <Link href={pages.commissions + '?' + qs.stringify({ type:router.query.type, expired: (!btn_state.expired).toString() })} passHref>
                            <ToggleButton active={btn_state.expired} componentClass="a">{t`Expired`}</ToggleButton>
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
})

export default CommissionsListing
