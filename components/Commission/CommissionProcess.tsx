import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns'
import { toDate } from 'date-fns-tz'
import Link from 'next/link';

import CommissionTimeline, { CommissionTimelineItem, TimelinePanel, TimelineTitle } from './CommissionTimeline';
import { useCommissionStore } from '@client/store/commission';
import { t } from '@utility/lang'
import { capitalizeFirstLetter } from '@utility/misc';
import { useUser } from '@hooks/user';
import { ButtonToolbar, Button, Grid, Row, Col, Icon } from 'rsuite';
import * as pages from '@utility/pages';

interface ProcessProps {
    data: any,
    is_owner: boolean,
    is_latest: boolean,
}

const PendingApproval = (props: ProcessProps) => {

    const store = useCommissionStore()
    let commission = store.get_commission()
    const to_name = commission ? commission.to_user.username : ''
    const [accept_loading, set_accept_loading] = useState(false)
    const [decline_loading, set_decline_loading] = useState(false)
    

    return (
        <React.Fragment>
            <TimelineTitle date={props.data.done ? toDate(new Date(props.data.done_date)) : undefined}>
             {t`Pending approval`}
            </TimelineTitle>
            <TimelinePanel>
                {props.is_owner && !commission.accepted && <p>{t`Waiting for approval from ${to_name}.`}</p>}
                {props.is_owner && commission.accepted  && <p>{t`Request was approved by ${to_name}.`}</p>}
                {!props.is_owner && commission.accepted && <p>{t`You approved of this commission request.`}</p>}
                {!props.is_owner && !commission.accepted && commission.finished && <p>{t`You declined this commission request.`}</p>}
                {!props.is_owner && !commission.accepted && !commission.finished &&
                <div>
                    <p>{t`Waiting for your approval.`}</p>
                    <p>
                        <ButtonToolbar>
                            <Button color="green" loading={accept_loading} onClick={(ev) => {ev.preventDefault(); set_accept_loading(true); store.accept().then(() => set_accept_loading(false))}}>{t`Accept`}</Button>
                            <Button color="red" loading={decline_loading} onClick={(ev) => {ev.preventDefault(); set_decline_loading(true); store.decline().then(() => set_decline_loading(false))}}>{t`Decline`}</Button>
                        </ButtonToolbar>
                    </p>
                </div>
                }
            </TimelinePanel>
        </React.Fragment>
    )
}

const PendingPayment = (props: ProcessProps) => {

    const count = props.data.data && props.data.data.count ? props.data.data.count : 0
    const last = props.data.data ? props.data.data.last : false
    const store = useCommissionStore()
    let commission = store.get_commission()
    const from_name = commission ? commission.from_user.username : ''

    return (
        <React.Fragment>
            <TimelineTitle date={props.data.done ? toDate(new Date(props.data.done_date)) : undefined}>
            {last ? t`Pending last payment` : count === 1 ? t`Pending first payment` : t`Pending payment`}
            </TimelineTitle>
            <TimelinePanel>
                {commission.finished && !props.data.done && <p>{t`Payment was cancelled.`}</p>}
                {!props.is_owner && props.data.done && <p>{t`Payment was received from ${from_name}.`}</p>}
                {!commission.finished && !props.is_owner && !props.data.done && <p>{t`Waiting for payment from ${from_name}.`}</p>}
                {props.is_owner && props.data.done && <p>{t`You sent your payment.`}</p>}
                {!commission.finished && props.is_owner && !props.data.done &&
                <div>
                    {count === 1 &&
                    <p>{t`Waiting for your first payment.`}</p>
                    }
                    {count > 1 && !last &&
                    <p>{t`Waiting for your payment.`}</p>
                    }
                    {last &&
                    <p>{t`Waiting for your last payment.`}</p>
                    }
                    <p>
                        <ButtonToolbar>
                            <Button color="green" onClick={(ev) => {ev.preventDefault(); store.pay(props.data)}}>{t`Pay`}</Button>
                        </ButtonToolbar>
                    </p>
                </div>
                }
            </TimelinePanel>
        </React.Fragment>
    )
}

const PendingProduct = (props: ProcessProps) => {

    const store = useCommissionStore()
    let commission = store.get_commission()
    const name = commission ? commission.to_user.username : ''

    const count = 1
    //const count = commission && commission.products ? commission.products.length : 0

    return (
        <React.Fragment>
            <TimelineTitle date={props.data.done ? toDate(new Date(props.data.done_date)) : undefined}>
            {t`Pending product`}
            </TimelineTitle>
            <TimelinePanel>
                {props.data.done && props.is_owner && <p>{t`There are ${count} product(s) available.`}</p>}
                {props.data.done && !props.is_owner && <p>{t`You have added ${count} product(s).`}</p>}
                {!props.data.done && props.is_owner && <p>{t`Waiting on ${name} to finish the commission request.`}</p>}
                {!props.data.done && !props.is_owner && !commission.finished &&
                <div>
                    <p>{t`Waiting for you to finish the request.`}</p>
                    {!!count &&
                    <React.Fragment>
                        <p>{t`You have added ${count} product(s).`}</p>
                        <p>
                            <ButtonToolbar>
                                <Button color="green" onClick={(ev) => {ev.preventDefault(); store.confirm_products()}}>{t`Confirm`}</Button>
                            </ButtonToolbar>
                        </p>
                    </React.Fragment>
                    }
                    {!!!count &&
                    <p>{t`Please upload the products in the Products tab.`}</p>
                    }
                </div>
                }
            </TimelinePanel>
        </React.Fragment>
    )
}

const Cancelled = (props: ProcessProps) => {

    const store = useCommissionStore()
    let commission = store.get_commission()
    let name = ''

    if (props.data.user) {
        let user = props.data.user
        if (typeof props.data.user === 'string') {
            if (commission.to_user._id === props.data.user) {
                user = commission.to_user
            }
            if (commission.from_user._id === props.data.user) {
                user = commission.from_user
            }
        }
        name = user.username
    }

    return (
        <React.Fragment>
            <TimelineTitle date={props.data.done_date}>
            {t`Cancelled`}
            </TimelineTitle>
            <TimelinePanel className="clearfix">
                <span className="float-right"><Icon className="text-red-300" icon="close" size="4x"/></span>
                <p>{t`Commission request was cancelled by ${name}.`}</p>
            </TimelinePanel>
        </React.Fragment>
    )
}

const Completed = (props: ProcessProps) => {

    const store = useCommissionStore()
    let commission = store.get_commission()

    const finished = commission ? commission.finished : false
    const completed = commission ? commission.completed : false

    const to_name = commission ? commission.to_user.username : ''
    const from_name = commission ? commission.from_user.username : ''

    let end_date = commission && commission.end_date ? toDate(new Date(commission.end_date)) : null

    let from_confirmed = false
    let to_confirmed = false

    if (props.data.data) {
        from_confirmed = props.data.data.confirmed.includes(commission.from_user._id)
        to_confirmed = props.data.data.confirmed.includes(commission.to_user._id)
    }

    return (
        <React.Fragment>
            <TimelineTitle date={completed && end_date ? end_date : undefined}>
            {finished ? t`Complete` : t`Confirm`}
            </TimelineTitle>
            <TimelinePanel>
                {completed &&
                <React.Fragment>
                    <span className="float-right"><Icon className="text-green-300" icon="check" size="4x"/></span>
                    <p>{t`Commission request was completed.`}</p>
                    {props.is_owner && <p>{t`Please check the Products section for your product(s).`}</p>}
                </React.Fragment>
                }
                {!completed &&
                <React.Fragment>
                    <p>{t`The commission request has not been completed yet.`}</p>
                </React.Fragment>
                }
                {!finished && !completed &&
                <React.Fragment>
                    <p>{t`Please mark as completed to finish the request.`}</p>
                    <hr/>
                <p><strong>{to_name}</strong> — { (to_confirmed) ? (<Icon icon="check" className="text-green-500"/>) : (<small className="muted">{t`Waiting for confirmation`} <Icon icon="spinner" spin/></small>)} </p>
                <p><strong>{from_name}</strong> — { (from_confirmed) ? (<Icon icon="check" className="text-green-500"/>) : (<small className="muted">{t`Waiting for confirmation`} <Icon icon="spinner" spin/></small>)} </p>
                </React.Fragment>
                }
            </TimelinePanel>
        </React.Fragment>
    )
}

interface ConfirmButtonProps {
    onRevoke?: any
    onComplete?: any
    revoke: boolean
    disabled?: boolean
    loading?: boolean
}

export const CompleteButton = (props: ConfirmButtonProps) => {
    return (
        <React.Fragment>
            {props.revoke &&
            <Button loading={props.loading} onClick={props.onRevoke} color="yellow">{t`Revoke completion`}</Button>
            }
            {!props.revoke &&
            <Button loading={props.loading} onClick={props.onComplete} disabled={props.disabled} color="green">{t`Mark as completed`}</Button>
            }
        </React.Fragment>
    )
}


const CommissionProcess = () => {
    const user = useUser()
    const store = useCommissionStore()
    let commission = store.get_commission()

    const [cancel_loading, set_cancel_loading] = useState(false)
    const [complete_loading, set_complete_loading] = useState(false)

    const is_finished = commission.finished
    const is_complete = commission.compelte
    let is_owner = user._id === commission.from_user._id
    let start_date = toDate(commission ? new Date(commission.created) : new Date())
    let end_date = commission && commission.end_date ? toDate(new Date(commission.end_date)) : null

    let phases = commission ? commission.phases : []
    let latest_stage = commission ? commission.stage : null

    let confirmed = false
    if (latest_stage.type === 'complete') {
        if (latest_stage.data && latest_stage.data.confirmed.includes(user._id)) {
            confirmed = true
        }
    }

    return (
        <div>
            <CommissionTimeline>
                <CommissionTimelineItem>
                    <TimelineTitle date={start_date}>
                        {capitalizeFirstLetter(formatDistanceToNow(start_date, {addSuffix: true}))}
                    </TimelineTitle>
                </CommissionTimelineItem>
                {phases.map((phase) => {
                    let is_latest = latest_stage ? phase._id === latest_stage._id : false
                    if (is_finished) {
                        is_latest = false
                    }
                    let el = null
                    switch(phase.type) {
                        case 'pending_approval':
                            el = (
                            <PendingApproval data={phase} is_latest={is_latest} is_owner={is_owner}/>
                            )
                            break
                        case 'pending_payment':
                            el = (
                            <PendingPayment data={phase} is_latest={is_latest} is_owner={is_owner}/>
                            )
                            break
                        case 'cancel':
                            el = (
                            <Cancelled data={phase} is_latest={is_latest} is_owner={is_owner}/>
                            )
                            break
                        case 'pending_product':
                            el = (
                            <PendingProduct data={phase} is_latest={is_latest} is_owner={is_owner}/>
                            )
                            break
                        case 'complete':
                            el = (
                            <Completed data={phase} is_latest={is_latest} is_owner={is_owner}/>
                            )
                            break
                        default:
                            null
                    }
                    return (
                        <CommissionTimelineItem key={phase._id}>
                            {el}
                        </CommissionTimelineItem>
                    )
                })
                }
                {!!end_date &&
                <CommissionTimelineItem>
                    <TimelineTitle date={end_date}>
                        {capitalizeFirstLetter(formatDistanceToNow(end_date, {addSuffix: true}))}
                    </TimelineTitle>
                </CommissionTimelineItem>
                }
            </CommissionTimeline>
            <Grid fluid className="my-5">
                <Row>
                    <Col xs={12}>
                    <ButtonToolbar>
                        {!is_finished && is_owner && <Button disabled={latest_stage.type === 'complete'} appearance="default">{t`Nudge`}</Button>}
                        {!is_finished && <CompleteButton
                            onRevoke={(ev) => {ev.preventDefault(); set_complete_loading(true); store.revoke_complete().then(() => set_complete_loading(false))}}
                            onComplete={(ev) => {ev.preventDefault(); set_complete_loading(true); store.complete().then(() => set_complete_loading(false))}}
                            revoke={confirmed} loading={complete_loading} disabled={latest_stage.type !== 'complete'}/>}
                        {!is_owner && !is_finished &&
                        <Link href={pages.commission + `/${commission._id}/products`} passHref>
                            <Button componentClass="a" appearance="primary">{t`Add Products(s)`}</Button>
                        </Link>
                        }
                        {is_owner && is_complete &&
                        <Link href={pages.commission + `/${commission._id}/products`} passHref>
                            <Button componentClass="a" appearance="primary">{t`Check Products(s)`}</Button>
                        </Link>
                        }
                    </ButtonToolbar>
                    </Col>
                    <Col xsOffset={9} xs={3}>
                    <ButtonToolbar>
                        {!is_finished && <Button className="ml-3" color="red" loading={cancel_loading} onClick={(ev) => {ev.preventDefault(); set_cancel_loading(true); store.cancel().then(() => set_cancel_loading(false))}}>{t`Cancel request`}</Button>}
                    </ButtonToolbar>
                    </Col>
                </Row>
            </Grid>
        </div>
    );
};

export default CommissionProcess;