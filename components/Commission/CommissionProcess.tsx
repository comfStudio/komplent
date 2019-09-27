import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns'
import { toDate } from 'date-fns-tz'

import CommissionTimeline, { CommissionTimelineItem, TimelinePanel, TimelineTitle } from './CommissionTimeline';
import { useCommissionStore } from '@client/store/commission';
import { t } from '@utility/lang'
import { capitalizeFirstLetter } from '@utility/misc';
import { useUser } from '@hooks/user';
import { ButtonToolbar, Button, Grid, Row, Col } from 'rsuite';

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
                {props.is_owner && !commission.accepted && <p>{t`Waiting for approval from ${to_name}`}</p>}
                {props.is_owner && commission.accepted  && <p>{t`Request was approved by ${to_name}`}</p>}
                {!props.is_owner && commission.accepted && <p>{t`You approved of this commission request`}</p>}
                {!props.is_owner && !commission.accepted && commission.finished && <p>{t`You declined this commission request`}</p>}
                {!props.is_owner && !commission.accepted && !commission.finished &&
                <div>
                    <p>{t`Waiting for your approval`}</p>
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

interface PaymentProps extends ProcessProps {
    count?: number
}

const PendingPayment = (props: PaymentProps) => {

    const count = props.count ? props.count : 1
    const store = useCommissionStore()
    let commission = store.get_commission()
    const from_name = commission ? commission.from_user.username : ''

    return (
        <React.Fragment>
            <TimelineTitle date={props.data.done ? toDate(new Date(props.data.done_date)) : undefined}>
            {t`Pending payment`}
            </TimelineTitle>
            <TimelinePanel>
                {!props.is_owner && <p>{t`Waiting for payment from ${from_name}`}</p>}
                {props.is_owner && <p>{t`Waiting for your payment`}</p>}
            </TimelinePanel>
        </React.Fragment>
    )
}

const PendingProduct = (props: ProcessProps) => {

    const to_name = props.commission ? props.commission.to_user.username : ''

    return (
        <React.Fragment>
            <TimelineTitle date={new Date()}>
            {t`Pending product`}
            </TimelineTitle>
            <TimelinePanel>
                {props.is_owner && <p>{t`Waiting on ${to_name} to finish the request`}</p>}
                {!props.is_owner && <p>{t`Waiting for you to finish the request`}</p>}
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
            <TimelinePanel>
                <p>{t`Commission request was cancelled by ${name}`}</p>
            </TimelinePanel>
        </React.Fragment>
    )
}

const Completed = (props: ProcessProps) => {

    const finished = props.commission ? props.commission.finished : false
    const completed = props.commission ? props.commission.completed : false

    let end_date = props.commission && props.commission.end_date ? toDate(new Date(props.commission.end_date)) : null

    return (
        <React.Fragment>
            <TimelineTitle date={completed && end_date ? end_date : undefined}>
            {t`Complete`}
            </TimelineTitle>
            <TimelinePanel>
                {completed &&
                <React.Fragment>
                    <p>{t`Commission request was completed`}</p>
                    {props.is_owner && <p>{t`Please check the Products section for your product(s)`}</p>}
                </React.Fragment>
                }
                {!completed &&
                <React.Fragment>
                    <p>{t`The commission request has not been completed yet`}</p>
                </React.Fragment>
                }
            </TimelinePanel>
        </React.Fragment>
    )
}


const CommissionProcess = () => {
    const user = useUser()
    const store = useCommissionStore()
    let commission = store.get_commission()

    const [cancel_loading, set_cancel_loading] = useState(false)

    const is_finished = commission.finished
    let is_owner = user._id === commission.from_user._id
    let start_date = toDate(commission ? new Date(commission.created) : new Date())
    let end_date = commission && commission.end_date ? toDate(new Date(commission.end_date)) : null

    let first_stage = commission ? commission.phases[0] : null
    let latest_stage = commission ? commission.phases[commission.phases.length-1] : null
    let phases = commission ? commission.phases : []


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
                    switch(phase.type) {
                        case 'pending_approval':
                            return (
                            <CommissionTimelineItem>
                                <PendingApproval data={phase} is_latest={is_latest} is_owner={is_owner}/>
                            </CommissionTimelineItem>
                            )
                        case 'pending_payment':
                            return (
                            <CommissionTimelineItem>
                                <PendingPayment data={phase} is_latest={is_latest} is_owner={is_owner}/>
                            </CommissionTimelineItem>
                            )
                        case 'cancel':
                            return (
                            <CommissionTimelineItem>
                                <Cancelled data={phase} is_latest={is_latest} is_owner={is_owner}/>
                            </CommissionTimelineItem>
                            )
                        default:
                            null
                            // <CommissionTimelineItem>
                            //     <PendingProduct is_owner={is_owner} commission={commission}/>
                            // </CommissionTimelineItem>
                            // <CommissionTimelineItem>
                            //     <PendingPayment is_owner={is_owner} commission={commission}/>
                            // </CommissionTimelineItem>
                            // <CommissionTimelineItem>
                            //     <Cancelled is_owner={is_owner} commission={commission}/>
                            // </CommissionTimelineItem>
                            // <CommissionTimelineItem>
                            //     <Completed is_owner={is_owner} commission={commission}/>
                            // </CommissionTimelineItem>
                    }
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
                        {!is_finished && is_owner && <Button appearance="default">{t`Nudge`}</Button>}
                        {!is_finished && <Button disabled color="green">{t`Mark as completed`}</Button>}
                    </ButtonToolbar>
                    </Col>
                    <Col xsOffset={10} xs={2}>
                    <ButtonToolbar>
                        {!is_finished && <Button className="ml-3" color="yellow" loading={cancel_loading} onClick={(ev) => {ev.preventDefault(); set_cancel_loading(true); store.cancel().then(() => set_cancel_loading(false))}}>{t`Cancel`}</Button>}
                    </ButtonToolbar>
                    </Col>
                </Row>
            </Grid>
        </div>
    );
};

export default CommissionProcess;