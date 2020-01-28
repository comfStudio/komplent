import React, { useState, useEffect, memo } from 'react'
import { formatDistanceToNow, format, addDays } from 'date-fns'
import { toDate } from 'date-fns-tz'
import Link from 'next/link'

import CommissionSteps, {
    CommissionStepItem,
    StepPanel,
    StepTitle,
    CommissionStepItemProps,
} from './CommissionSteps'
import { useCommissionStore } from '@client/store/commission'
import { t } from '@utility/lang'
import { capitalizeFirstLetter, decimal128ToMoneyToString, price_is_null } from '@utility/misc'
import { useUser } from '@hooks/user'
import { ButtonToolbar, Button, Grid, Row, Col, Icon, Modal } from 'rsuite'
import * as pages from '@utility/pages'
import { CommissionPhaseType } from '@server/constants'
import { CommissionProcessType } from '@schema/user'
import NoSSR from '@components/App/NoSSR'
import PriceSuggestionForm from '@components/Form/PriceSuggestionForm'

interface ProcessProps extends CommissionStepItemProps {
    data: any
    is_owner?: boolean
    is_latest?: boolean
    onClick?: any
    done_date?: Date
    hidden?: boolean
    active?: boolean
}

export const ApprovalButtons = memo(function ApprovalButtons() {
    const store = useCommissionStore()
    let commission = store.get_commission()

    const [accept_loading, set_accept_loading] = useState(false)
    const [decline_loading, set_decline_loading] = useState(false)

    const custom_price = price_is_null(commission.rate.price)

    return (
        <ButtonToolbar>
            <Button
                color="green"
                loading={accept_loading}
                disabled={custom_price}
                onClick={ev => {
                    ev.preventDefault()
                    set_accept_loading(true)
                    store.accept().then(() => set_accept_loading(false))
                }}>{t`Accept`}</Button>
            <Button
                color="red"
                loading={decline_loading}
                onClick={ev => {
                    ev.preventDefault()
                    set_decline_loading(true)
                    store.decline().then(() => set_decline_loading(false))
                }}>{t`Decline`}</Button>
        </ButtonToolbar>
    )
})

const PendingApproval = memo(function PendingApproval(props: ProcessProps) {
    const store = useCommissionStore()
    let commission = store.get_commission()
    const to_name = commission ? commission.to_user.username : ''
    const show_panel = !props.hidden || props.active

    return (
        <CommissionStepItem {...props}>
            <StepTitle onClick={props.onClick} date={props.done_date}>
                {commission.accepted ? t`Approved` : t`Pending approval`}
            </StepTitle>
            {show_panel && (
                <StepPanel>
                    {props.is_owner && !commission.accepted && (
                        <p>{t`Waiting for approval from @${to_name}.`}</p>
                    )}
                    {props.is_owner && commission.accepted && (
                        <p>{t`Request was approved by @${to_name}.`}</p>
                    )}
                    {!props.is_owner && commission.accepted && (
                        <p>{t`You approved of this commission request.`}</p>
                    )}
                    {!props.is_owner &&
                        !commission.accepted &&
                        commission.finished && (
                            <p>{t`You declined this commission request.`}</p>
                        )}
                    {!props.is_owner &&
                        !commission.accepted &&
                        !commission.finished && (
                            <div>
                                <p>{t`Waiting for your approval.`}</p>
                                <p>
                                    <ApprovalButtons />
                                </p>
                            </div>
                        )}
                </StepPanel>
            )}
        </CommissionStepItem>
    )
})

const PendingPayment = memo(function PendingPayment(props: ProcessProps) {
    const count =
        props.data && props.data.data && props.data.data.count
            ? props.data.data.count
            : 0
    const last = props.data && props.data.data ? props.data.data.last : false
    const store = useCommissionStore()
    let commission = store.get_commission()
    const from_name = commission ? commission.from_user.username : ''
    const done = props.data ? props.data.done : false
    const show_panel = !props.hidden || props.active
    const price = price_is_null(commission.rate.price) ? t`custom price` : decimal128ToMoneyToString(commission.rate.price)

    return (
        <CommissionStepItem {...props}>
            <StepTitle onClick={props.onClick} date={props.done_date}>
                {/* {!props.hidden && !done ? (last ? t`Pending last payment` : count === 1 ? t`Pending first payment` : t`Pending payment`) : null} */}
                {!props.hidden && !done ? t`Pending payment` : null}
                {/* {props.hidden || done ? (last ? t`Last payment` : count === 1 ? t`First payment` : t`Payment`) : null} */}
                {props.hidden || done ? t`Payment` : null}
            </StepTitle>
            {show_panel && (
                <StepPanel>
                    {commission.finished && !done && (
                        <p>{t`Payment was cancelled.`}</p>
                    )}
                    {!props.is_owner && done && (
                        <p>{t`Payment was received from @${from_name}.`}</p>
                    )}
                    {!commission.finished && !props.is_owner && !done && (
                        <p>{t`Waiting for payment from @${from_name}.`}</p>
                    )}
                    {props.is_owner && done && (
                        <p>{t`You sent your payment.`}</p>
                    )}
                    {!commission.finished && props.is_owner && !done && (
                        <div>
                            {false && count === 1 && (
                                <p>{t`Waiting for your first payment.`}</p>
                            )}
                            {true && <p>{t //count > 1 && !last &&
                                `Waiting for your payment.`}</p>}
                            {false && last && (
                                <p>{t`Waiting for your last payment.`}</p>
                            )}
                            {!props.hidden && (
                                <p>
                                    <ButtonToolbar>
                                        <Button
                                            appearance="primary"
                                            onClick={ev => {
                                                ev.preventDefault()
                                                store.pay(props.data)
                                            }}>{t`Pay ${price}`}</Button>
                                    </ButtonToolbar>
                                </p>
                            )}
                        </div>
                    )}
                </StepPanel>
            )}
        </CommissionStepItem>
    )
})

const RevisionButton = memo(function RevisionButton() {
    const store = useCommissionStore()
    const [revision_loading, set_revisions_loading] = useState(false)

    let revisions_count = 0
    let d_stages = store.get_next_stages()
    while (d_stages[0].type === 'revision') {
        let v = d_stages.shift()
        revisions_count += v.count ?? 0
    }

    return (
        <>
            {!!revisions_count && (
                <Button
                    loading={revision_loading}
                    appearance="primary"
                    onClick={ev => {
                        ev.preventDefault()
                        set_revisions_loading(true)
                        store
                            .add_revision_phase()
                            .then(() => set_revisions_loading(false))
                    }}>
                    {t`Request changes`}
                    {` (${revisions_count})`}
                </Button>
            )}
            {!!!revisions_count && (
                <Button
                    disabled={true}
                    appearance="primary">{t`No changes are allowed`}</Button>
            )}
        </>
    )
})

const PendingDraft = memo(function PendingDraft(props: ProcessProps) {
    const [accept_loading, set_accept_loading] = useState(false)
    const [skip_loading, set_skip_loading] = useState(false)

    const store = useCommissionStore()
    let commission = store.get_commission()
    const from_name = commission ? commission.from_user.username : ''
    const to_name = commission ? commission.to_user.username : ''
    const done = props.data ? props.data.done : false

    const count = commission && commission.drafts ? commission.drafts.length : 0

    const show_panel = !props.hidden || props.active

    return (
        <CommissionStepItem {...props}>
            <StepTitle onClick={props.onClick} date={props.done_date}>
                {props.hidden || done ? t`Initial draft` : t`Pending drafts`}
            </StepTitle>
            {show_panel && (
                <StepPanel>
                    {done && <p>{t`There are ${count} drafts available.`}</p>}
                    {!done &&
                        props.is_owner &&
                        !commission.finished &&
                        !!!count && (
                            <p>{t`Waiting on @${to_name} to provide a draft.`}</p>
                        )}
                    {!done && !props.is_owner && !commission.finished && (
                        <div>
                            {!!count && (
                                <React.Fragment>
                                    <p>{t`You have added ${count} draft items.`}</p>
                                </React.Fragment>
                            )}
                            {!!!count && (
                                <React.Fragment>
                                    <p>{t`Please upload the draft in the Drafts tab.`}</p>
                                </React.Fragment>
                            )}
                        </div>
                    )}
                    {!done && !commission.finished && (
                        <ButtonToolbar>
                            {!!!props.is_owner && (
                                <Link href={pages.commission + `/${commission._id}/drafts`}>
                                    <Button appearance="primary" componentClass="a">{t`Upload a Draft`}</Button>
                                </Link>
                            )}
                            <Button
                                appearance="default"
                                loading={skip_loading}
                                onClick={ev => {
                                    ev.preventDefault()
                                    set_skip_loading(true)
                                    store
                                        .skip_drafts()
                                        .then(() => set_skip_loading(false))
                                }}>{ count ? t`Done` : t`Skip`}</Button>
                        </ButtonToolbar>
                    )}
                    {!done && props.is_owner && !commission.finished && (
                        <div>
                            {!!count && (
                                <React.Fragment>
                                    <p>{t`Waiting for you to confirm the drafts.`}</p>
                                    <p>
                                        <ButtonToolbar>
                                            <Button
                                                loading={accept_loading}
                                                color="green"
                                                onClick={ev => {
                                                    ev.preventDefault()
                                                    set_accept_loading(true)
                                                    store
                                                        .confirm_drafts()
                                                        .then(() =>
                                                            set_accept_loading(
                                                                false
                                                            )
                                                        )
                                                }}>{t`Confirm`}</Button>
                                            <RevisionButton />
                                        </ButtonToolbar>
                                    </p>
                                </React.Fragment>
                            )}
                        </div>
                    )}
                </StepPanel>
            )}
        </CommissionStepItem>
    )
})

const Revision = memo(function Revision(props: ProcessProps) {
    const [accept_loading, set_accept_loading] = useState(false)
    const store = useCommissionStore()
    let commission = store.get_commission()
    const name = commission ? commission.from_user.username : ''
    const done = props.data ? props.data.done : false

    let from_confirmed = false
    let to_confirmed = false

    if (props.data?.data) {
        from_confirmed = props.data.data.confirmed.includes(
            commission.from_user._id
        )
        to_confirmed = props.data.data.confirmed.includes(
            commission.to_user._id
        )
    }

    const show_panel = !props.hidden || props.active

    return (
        <CommissionStepItem {...props}>
            <StepTitle onClick={props.onClick} date={props.done_date}>
                {t`Revision`}
            </StepTitle>
            {show_panel && (
                <StepPanel>
                    {done && <p>{t`Changed were requested.`}</p>}
                    {!done && !props.is_owner && !to_confirmed && (
                        <p>{t`@${name} is asking for changes.`}</p>
                    )}
                    {!done && !commission.finished && (
                        <>
                            {!props.is_owner && !to_confirmed && (
                                <p>{t`Please complete the requested changes and upload a new revision.`}</p>
                            )}
                            {props.is_owner && !to_confirmed && (
                                <p>{t`Please wait for the requested changes to be completed.`}</p>
                            )}
                            {!props.is_owner && to_confirmed && (
                                <p>{t`Please wait for @${name} to confirm the changes.`}</p>
                            )}
                            {props.is_owner && to_confirmed && (
                                <p>{t`Waiting for you to confirm the requested changes.`}</p>
                            )}
                            <ButtonToolbar>
                                {!props.is_owner && !to_confirmed && (
                                    <Button
                                        loading={accept_loading}
                                        color="green"
                                        onClick={ev => {
                                            ev.preventDefault()
                                            set_accept_loading(true)
                                            store
                                                .confirm_revision()
                                                .then(() =>
                                                    set_accept_loading(false)
                                                )
                                        }}>{t`Done`}</Button>
                                )}
                                {props.is_owner && to_confirmed && (
                                    <Button
                                        loading={accept_loading}
                                        color="green"
                                        onClick={ev => {
                                            ev.preventDefault()
                                            set_accept_loading(true)
                                            store
                                                .confirm_revision()
                                                .then(() =>
                                                    set_accept_loading(false)
                                                )
                                        }}>{t`Confirm`}</Button>
                                )}
                            </ButtonToolbar>
                        </>
                    )}
                </StepPanel>
            )}
        </CommissionStepItem>
    )
})

const PendingProduct = memo(function PendingProduct(props: ProcessProps) {
    const user = useUser()
    const [count, set_count] = useState(0)
    const [accept_loading, set_accept_loading] = useState(false)

    const store = useCommissionStore()
    let commission = store.get_commission()
    const name = commission?.to_user.username ?? ''
    const done = props?.data?.done ?? false

    const show_panel = !props.hidden || props.active

    useEffect(() => {
        if (commission && store.is_unlocked(user, commission)) {
            store.load_products(commission._id).then(r => set_count(r.length))
        }
    }, [commission])

    return (
        <CommissionStepItem {...props}>
            <StepTitle onClick={props.onClick} date={props.done_date}>
                {props.hidden || done ? t`Assets` : t`Pending assets`}
            </StepTitle>
            {show_panel && (
                <StepPanel>
                    {!!count && props.is_owner && (
                        <p>{t`There are ${count} asset(s) available.`}</p>
                    )}
                    {done && !props.is_owner && (
                        <p>{t`You have added ${count} asset(s).`}</p>
                    )}
                    {!done && !!!count && props.is_owner && (
                        <p>{t`Waiting on @${name} to finish the commission request.`}</p>
                    )}
                    {!done && !commission.finished && (
                        <>
                            {!props.is_owner && (
                                <p>{t`Waiting for you to finish the request.`}</p>
                            )}
                            {!props.is_owner && !!count && (
                                <p>{t`You have added ${count} asset(s).`}</p>
                            )}
                            {!!count && (
                                <ButtonToolbar>
                                    <Button
                                        loading={accept_loading}
                                        color="green"
                                        onClick={ev => {
                                            ev.preventDefault()
                                            set_accept_loading(true)
                                            store
                                                .confirm_products()
                                                .then(() =>
                                                    set_accept_loading(false)
                                                )
                                        }}>{t`Done`}</Button>
                                    {props.is_owner && <RevisionButton />}
                                </ButtonToolbar>
                            )}
                            {!!!count && (
                                <p>{t`Please upload the assets in the Assets tab.`}</p>
                            )}
                        </>
                    )}
                </StepPanel>
            )}
        </CommissionStepItem>
    )
})

const Cancelled = memo(function Cancelled(props: ProcessProps) {
    const store = useCommissionStore()
    let commission = store.get_commission()
    let name = ''

    if (props.data && props.data.user) {
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
        <CommissionStepItem {...props}>
            <StepTitle onClick={props.onClick} date={props.done_date}>
                {t`Cancelled`}
            </StepTitle>
            <StepPanel className="clearfix">
                <span className="float-right">
                    <Icon className="text-red-300" icon="close" size="4x" />
                </span>
                <p>{t`Commission request was cancelled by @${name}.`}</p>
            </StepPanel>
        </CommissionStepItem>
    )
})

const Expired = memo(function Expired(props: ProcessProps) {
    return (
        <CommissionStepItem {...props}>
            <StepTitle onClick={props.onClick} date={props.done_date}>
                {t`Expired`}
            </StepTitle>
            <StepPanel className="clearfix">
                <span className="float-right">
                    <Icon className="text-red-300" icon="close" size="4x" />
                </span>
                <p>{t`Commission has expired`}</p>
            </StepPanel>
        </CommissionStepItem>
    )
})

const Negotiating = memo(function Negotiating(props: ProcessProps) {
    const store = useCommissionStore()
    let commission = store.get_commission()
    const current_user_id = props.is_owner ? commission.from_user._id : commission.to_user._id

    const done = props?.data?.done ?? false
    const price = price_is_null(commission.rate.price) ? t`None` : decimal128ToMoneyToString(commission.rate.price)

    return (
        <CommissionStepItem {...props}>
            <StepTitle onClick={props.onClick} date={props.done_date}>
            {props.hidden || done ? t`Negotiated price: ${price}` : t`Negotiating price`}
            </StepTitle>
            <StepPanel className="clearfix">
                {!done && (
                    <PriceSuggestionForm
                        onAcceptPrice={() => store.accept_suggested_price()}
                        onSuggestPrice={v => store.suggest_price(v)}
                        waiting={commission.suggested_price_user === current_user_id}
                        user={commission.suggested_price_user === commission.to_user._id ? commission.to_user : commission.from_user}
                        price={commission.suggested_price}/>
                    )}
                {done && <p>{t`A price was negotiated`}</p>}
            </StepPanel>
        </CommissionStepItem>
    )
})

const Unlocked = memo(function Unlocked(props: ProcessProps) {
    const done = props.data ? props.data.done : false
    const show_panel = !props.hidden || props.active

    return (
        <CommissionStepItem {...props}>
            <StepTitle onClick={props.onClick} date={props.done_date}>
                {t`Unlock`}
            </StepTitle>
            {show_panel && (
                <StepPanel>
                    {!done && (
                        <p>{t`Commission asset(s) will get unlocked`}</p>
                    )}
                    {done && <p>{t`Commission asset(s) is now unlocked!`}</p>}
                </StepPanel>
            )}
        </CommissionStepItem>
    )
})

const Refund = memo(function Refund(props: ProcessProps) {
    const done = props.data ? props.data.done : false
    const show_panel = !props.hidden || props.active

    return (
        <CommissionStepItem {...props}>
            <StepTitle onClick={props.onClick} date={props.done_date}>
                {t`Refund`}
            </StepTitle>
            {show_panel && (
                <StepPanel>
                    {!done && (
                        <p className="muted">
                            {t`Refunding...`} <Icon icon="spinner" spin />
                        </p>
                    )}
                    {done && (
                        <p>
                            {t`Payment has been refunded`}{' '}
                            <Icon icon="check" className="text-green-500" />
                        </p>
                    )}
                </StepPanel>
            )}
        </CommissionStepItem>
    )
})

const Completed = memo(function Completed(props: ProcessProps) {
    const store = useCommissionStore()
    let commission = store.get_commission()

    const finished = commission ? commission.finished : false
    const completed = commission ? commission.completed : false

    const to_name = commission ? commission.to_user.username : ''
    const from_name = commission ? commission.from_user.username : ''

    let end_date = commission?.end_date
        ? toDate(new Date(commission.end_date))
        : null
    let accept_date = commission?.accept_date
        ? toDate(new Date(commission.accept_date))
        : null

    let from_confirmed = false
    let to_confirmed = false

    if (props.data && props.data.data) {
        from_confirmed = props.data.data.confirmed.includes(
            commission.from_user._id
        )
        to_confirmed = props.data.data.confirmed.includes(
            commission.to_user._id
        )
    }

    const show_panel = !props.hidden || props.active

    let deadline_txt = ''
    if (!finished && accept_date && commission.commission_deadline) {
        deadline_txt = ` (${formatDistanceToNow(
            addDays(accept_date, commission.commission_deadline),
            { addSuffix: true }
        )})`
    }

    return (
        <CommissionStepItem {...props}>
            <StepTitle
                onClick={props.onClick}
                date={completed && end_date ? end_date : undefined}>
                {finished || props.hidden
                    ? t`Complete` + deadline_txt
                    : t`Confirm`}
            </StepTitle>
            {show_panel && (
                <StepPanel>
                    {completed && (
                        <React.Fragment>
                            <span className="float-right">
                                <Icon
                                    className="text-green-300"
                                    icon="check"
                                    size="4x"
                                />
                            </span>
                            <p>{t`Commission request was completed.`}</p>
                            {props.is_owner && (
                                <p>{t`Please check the Assets section for your asset(s).`}</p>
                            )}
                        </React.Fragment>
                    )}
                    {!completed && (
                        <React.Fragment>
                            <p>{t`The commission request is almost done.`}</p>
                        </React.Fragment>
                    )}
                    {!finished && !completed && (
                        <React.Fragment>
                            <p>{t`Please mark as completed to finish the request.`}</p>
                            <hr />
                            <p>
                                <strong>{to_name}</strong> —{' '}
                                {to_confirmed ? (
                                    <Icon
                                        icon="check"
                                        className="text-green-500"
                                    />
                                ) : (
                                    <small className="muted">
                                        {t`Waiting for confirmation`}{' '}
                                        <Icon icon="spinner" spin />
                                    </small>
                                )}{' '}
                            </p>
                            <p>
                                <strong>{from_name}</strong> —{' '}
                                {from_confirmed ? (
                                    <Icon
                                        icon="check"
                                        className="text-green-500"
                                    />
                                ) : (
                                    <small className="muted">
                                        {t`Waiting for confirmation`}{' '}
                                        <Icon icon="spinner" spin />
                                    </small>
                                )}{' '}
                            </p>
                        </React.Fragment>
                    )}
                </StepPanel>
            )}
        </CommissionStepItem>
    )
})

interface ConfirmButtonProps {
    onRevoke?: any
    onComplete?: any
    revoke: boolean
    disabled?: boolean
    loading?: boolean
}

export const CompleteButton = memo(function CompleteButton(props: ConfirmButtonProps) {
    return (
        <React.Fragment>
            {props.revoke && (
                <Button
                    loading={props.loading}
                    onClick={props.onRevoke}
                    color="yellow">{t`Revoke completion`}</Button>
            )}
            {!props.revoke && (
                <Button
                    loading={props.loading}
                    onClick={props.onComplete}
                    disabled={props.disabled}
                    color="green">{t`Mark as completed`}</Button>
            )}
        </React.Fragment>
    )
})

const CommissionProcess = memo(function CommissionProcess() {
    const user = useUser()
    const store = useCommissionStore()
    let commission = store.get_commission()

    const [confirm_cancel, set_confirm_cancel] = useState(false)
    const [cancel_loading, set_cancel_loading] = useState(false)
    const [complete_loading, set_complete_loading] = useState(false)
    const [selected, set_selected] = useState('')

    const is_finished = commission.finished
    const is_complete = commission.completed
    let is_owner = user?._id === commission.from_user._id
    let start_date = toDate(
        commission ? new Date(commission.created) : new Date()
    )
    let end_date = commission?.end_date
        ? toDate(new Date(commission.end_date))
        : null

    let phases = commission?.phases ?? []
    let latest_stage = commission?.stage ?? null
    let def_stages: CommissionProcessType[] = store.state.stages

    let confirmed = false
    let is_confirming = false
    if (latest_stage.type === 'complete') {
        is_confirming = true
        if (
            latest_stage.data &&
            latest_stage.data.confirmed.includes(user?._id)
        ) {
            confirmed = true
        }
    }

    let unvisited_phases = []

    if (!is_finished && !is_confirming) {
        let curr_stages_values = phases.map(v => v.type)
        def_stages.forEach((v, idx) => {
            if (curr_stages_values.includes(v.type)) {
                curr_stages_values.splice(curr_stages_values.indexOf(v.type), 1)
            } else {
                switch (v.type) {
                    case 'negotiate': {
                        unvisited_phases.push(
                            <Negotiating
                                key={idx}
                                hidden
                                data={null}
                                is_owner={is_owner}
                            />
                        )
                        break
                    }
                    case 'pending_approval': {
                        unvisited_phases.push(
                            <PendingApproval
                                key={idx}
                                hidden
                                data={null}
                                is_owner={is_owner}
                            />
                        )
                        break
                    }
                    case 'pending_payment': {
                        unvisited_phases.push(
                            <PendingPayment
                                key={idx}
                                hidden
                                data={{ data: { last: false, count: 1 } }}
                                is_owner={is_owner}
                            />
                        )
                        break
                    }
                    case 'pending_sketch': {
                        unvisited_phases.push(
                            <PendingDraft
                                key={idx}
                                hidden
                                data={null}
                                is_owner={is_owner}
                            />
                        )
                        break
                    }
                    case 'pending_product': {
                        unvisited_phases.push(
                            <PendingProduct
                                key={idx}
                                hidden
                                data={null}
                                is_owner={is_owner}
                            />
                        )
                        break
                    }
                    case 'unlock': {
                        unvisited_phases.push(
                            <Unlocked
                                key={idx}
                                hidden
                                data={null}
                                is_owner={is_owner}
                            />
                        )
                        break
                    }
                    case 'complete': {
                        unvisited_phases.push(
                            <Completed
                                key={idx}
                                hidden
                                data={null}
                                is_owner={is_owner}
                            />
                        )
                        break
                    }
                }
            }
        })
    }

    let latest_idx = 0

    phases.forEach(v => {
        if (["pending_approval"].includes(v.type)) {
            latest_idx++
        }
    })

    return (
        <div>
            <NoSSR>
            <CommissionSteps current={latest_idx} className="ml-5">
                <CommissionStepItem>
                    <StepTitle date={start_date}>
                        {capitalizeFirstLetter(
                            formatDistanceToNow(start_date, { addSuffix: true })
                        )}
                    </StepTitle>
                </CommissionStepItem>
                {phases.map(phase => {

                    let is_latest = latest_stage
                        ? phase._id === latest_stage._id
                        : false
                    if (is_finished) {
                        is_latest = false
                    }
                    let on_select = ev => {
                        ev.preventDefault()
                        set_selected(v => (v == phase._id ? '' : phase._id))
                    }
                    let done_date = phase.done
                        ? toDate(new Date(phase.done_date))
                        : undefined

                    let El = null

                    switch (phase.type) {
                        case 'negotiate':
                            El = Negotiating
                            break
                        case 'pending_approval':
                            El = PendingApproval
                            break
                        case 'pending_sketch':
                            El = PendingDraft
                            break
                        case 'revision':
                            El = Revision
                            break
                        case 'pending_payment':
                            El = PendingPayment
                            break
                        case 'cancel':
                            El = Cancelled
                            break
                        case 'expire':
                            El = Expired
                            break
                        case 'refund':
                            El = Refund
                            break
                        case 'pending_product':
                            El = PendingProduct
                            break
                        case 'unlock':
                            El = Unlocked
                            break
                        case 'complete':
                            El = Completed
                            break
                        default:
                            return null
                    }
                    return (
                        <El
                            key={phase._id}
                            selected={selected === phase._id}
                            active={is_latest || selected === phase._id}
                            onClick={on_select}
                            done_date={done_date}
                            status={['expire'].includes(phase.type) ? "error" : phase.done ?  'finish': is_latest ? 'process' : 'error'}
                            data={phase}
                            is_latest={is_latest}
                            is_owner={is_owner}
                        />
                    )
                })}
                {unvisited_phases}
                {!!end_date && (
                    <CommissionStepItem active status={is_complete ? "finish" : "error"}>
                        <StepTitle date={end_date}>
                            {capitalizeFirstLetter(
                                formatDistanceToNow(end_date, {
                                    addSuffix: true,
                                })
                            )}
                        </StepTitle>
                    </CommissionStepItem>
                )}
            </CommissionSteps>
            <Grid fluid className="mt-3">
                <Row>
                    <Col xs={12}>
                        <ButtonToolbar>
                            {/* {!is_finished && is_owner && (
                                <Button
                                    disabled={latest_stage.type === 'complete'}
                                    appearance="default">{t`Nudge`}</Button>
                            )} */}
                            {!is_finished && (
                                <CompleteButton
                                    onRevoke={ev => {
                                        ev.preventDefault()
                                        set_complete_loading(true)
                                        store
                                            .revoke_complete()
                                            .then(() =>
                                                set_complete_loading(false)
                                            )
                                    }}
                                    onComplete={ev => {
                                        ev.preventDefault()
                                        set_complete_loading(true)
                                        store
                                            .complete()
                                            .then(() =>
                                                set_complete_loading(false)
                                            )
                                    }}
                                    revoke={confirmed}
                                    loading={complete_loading}
                                    disabled={latest_stage.type !== 'complete'}
                                />
                            )}
                            {!is_owner && !is_finished && (
                                <Link
                                    href={
                                        pages.commission +
                                        `/${commission._id}/assets`
                                    }
                                    passHref>
                                    <Button
                                        componentClass="a"
                                        appearance="primary">{t`Add Asset`}</Button>
                                </Link>
                            )}
                            {!is_owner && !is_finished && (
                                <Link
                                    href={
                                        pages.commission +
                                        `/${commission._id}/drafts`
                                    }
                                    passHref>
                                    <Button
                                        componentClass="a"
                                        appearance="default">{t`Add Draft`}</Button>
                                </Link>
                            )}
                            {is_owner && is_complete && (
                                <Link
                                    href={
                                        pages.commission +
                                        `/${commission._id}/assets`
                                    }
                                    passHref>
                                    <Button
                                        componentClass="a"
                                        appearance="primary">{t`Check Assets`}</Button>
                                </Link>
                            )}
                        </ButtonToolbar>
                    </Col>
                    <Col xsOffset={9} xs={3}>
                        <Modal show={confirm_cancel} onHide={ev => set_confirm_cancel(false)}>
                            <Modal.Header>
                                <Modal.Title>{t`Cancel the commission?`}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {t`Are you sure you want to cancel the commission?`}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={ev => {
                                        ev.preventDefault()
                                        set_cancel_loading(true)
                                        store
                                            .cancel()
                                            .then(() => {
                                                set_cancel_loading(false)
                                                set_confirm_cancel(false)
                                            }
                                            )
                                    }} loading={cancel_loading} appearance="primary">
                                {t`Yes, cancel`}
                                </Button>
                                <Button onClick={ev => set_confirm_cancel(false)} appearance="subtle">
                                {t`No`}
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <ButtonToolbar>
                            {!is_finished && (
                                <Button
                                    className="ml-3"
                                    color="red"
                                    onClick={ev => {
                                        ev.preventDefault()
                                        set_confirm_cancel(true)
                                    }}>{t`Cancel request`}</Button>
                            )}
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Grid>
            </NoSSR>
        </div>
    )
})

export default CommissionProcess
