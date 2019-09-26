import React from 'react';
import { formatDistanceToNow, format } from 'date-fns'
import { toDate } from 'date-fns-tz'

import CommissionTimeline, { CommissionTimelineItem, TimelinePanel, TimelineTitle } from './CommissionTimeline';
import { useCommissionStore } from '@store/commission';
import { t } from '@utility/lang'
import { capitalizeFirstLetter } from '@utility/misc';
import { useUser } from '@hooks/user';
import { ButtonToolbar, Button, Grid, Row, Col } from 'rsuite';

interface ProcessProps {
    is_owner: boolean,
    commission: object
}

const PendingApproval = (props: ProcessProps) => {

    const to_name = props.commission ? props.commission.to_user.username : ''

    return (
        <React.Fragment>
            <TimelineTitle date={new Date()}>
             {t`Pending approval`}
            </TimelineTitle>
            <TimelinePanel>
                {props.is_owner && <p>{t`Waiting for approval from ${to_name}`}</p>}
                {!props.is_owner && <p>{t`You approved of this commission request`}</p>}
            </TimelinePanel>
        </React.Fragment>
    )
}

interface PaymentProps extends ProcessProps {
    count?: number
}

const PendingPayment = (props: PaymentProps) => {

    const count = props.count ? props.count : 1
    const from_name = props.commission ? props.commission.from_user.username : ''

    return (
        <React.Fragment>
            <TimelineTitle date={new Date()}>
            {t`Pending payment`}
            </TimelineTitle>
            <TimelinePanel>
                {!props.is_owner && <p>{t`Waiting for payment from ${from_name}`}</p>}
                {props.is_owner && <p>{t`Waiting for you payment`}</p>}
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

    const name = props.commission ? props.commission.to_user.username : ''

    return (
        <React.Fragment>
            <TimelineTitle date={new Date()}>
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

    let end_date = props.commission && props.commission.end_date ? toDate(new Date(commission.end_date)) : null

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
    const [state, actions] = useCommissionStore()

    let commission = actions.get_commission()
    let is_owner = user._id === commission.from_user._id
    let start_date = toDate(commission ? new Date(commission.created) : new Date())
    let end_date = commission && commission.end_date ? toDate(new Date(commission.end_date)) : null

    let first_stage = commission ? commission.phases[0] : null
    let latest_stage = commission ? commission.stage : null
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
                    switch(phase.type) {
                        case 'pending_approval':
                            return (
                            <CommissionTimelineItem>
                                <PendingApproval is_owner={is_owner} commission={commission}/>
                            </CommissionTimelineItem>
                            )
                        default:
                            null
                            // <CommissionTimelineItem>
                            //     <PendingPayment is_owner={is_owner} commission={commission}/>
                            // </CommissionTimelineItem>
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
                        {is_owner && <Button appearance="default">{t`Nudge`}</Button>}
                        <Button disabled color="green">{t`Mark as completed`}</Button>
                    </ButtonToolbar>
                    </Col>
                    <Col xsOffset={10} xs={2}>
                    <ButtonToolbar>
                        <Button className="ml-3" color="yellow">{t`Cancel`}</Button>
                    </ButtonToolbar>
                    </Col>
                </Row>
            </Grid>
        </div>
    );
};

export default CommissionProcess;