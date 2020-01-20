import {
    TASK,
    EVENT,
    TaskDataTypeMap,
    CommissionPhaseT,
    CommissionPhaseType,
} from '@server/constants'
import { Event, Commission, CommissionPhase } from '@db/models'
import log from '@utility/log'
import { CommissionProcessType } from '@schema/user'

export default function(queue) {
    let r = [
        TASK.commission_phase_updated,
        TASK.commission_refund,
        TASK.commission_deadline,
        TASK.commission_request_deadline,
    ].reduce((a, v) => {
        let d = { ...a }
        d[v] = queue
        return d
    }, {} as any)

    queue.process(TASK.commission_phase_updated, async job => {
        log.debug(`processing ${TASK.commission_phase_updated}`)
        const {
            user_id,
            commission_id,
            phase,
            from_user_id,
            to_user_id,
        } = job.data as TaskDataTypeMap<TASK.commission_phase_updated>
        let e = new Event({
            type: EVENT.commission_phase_updated,
            from_user: user_id,
            data: { phase, commission_id, from_user_id, to_user_id },
        })
        await e.save()
    })

    queue.process(TASK.commission_refund, async job => {
        log.debug(`processing ${TASK.commission_refund}`)
        const { commission_id, phase } = job.data as TaskDataTypeMap<
            TASK.commission_refund
        >

        const commission = await Commission.findById(commission_id)
        if (commission && commission.refunding) {
            const stage = await CommissionPhase.findById(phase._id)
            stage.done = true

            commission.refunding = false
            commission.refunded = true
            // end
            if (!commission.finished) {
                commission.finished = true
                commission.completed = false
                commission.end_date = new Date()
            }
            commission.save()
            stage.save()
        }
    })

    queue.process(TASK.commission_deadline, async job => {
        log.debug(`processing ${TASK.commission_deadline}`)
        const {
            commission_id,
            from_user_id,
            to_user_id,
        } = job.data as TaskDataTypeMap<TASK.commission_deadline>

        const commission = await Commission.findById(commission_id)

        let unlocked = false

        let done_stages: CommissionProcessType[] = commission.phases.filter(
            v => v.done
        )
        if (done_stages.filter(v => v.type == CommissionPhaseT.unlock).length) {
            unlocked = true
        }

        if (commission && !commission.finished && !commission.refunding) {
            const d = new Date()

            // add expire phase
            let expire_phase = new CommissionPhase({
                type: CommissionPhaseT.expire,
                commission: commission._id,
                done: true,
                done_date: d,
                data: { commission_deadline: commission.commission_deadline },
                user: to_user_id,
            })
            expire_phase.save()

            // end
            commission.finished = true
            commission.completed = false
            commission.end_date = d
            commission.expire_date = d
            commission.save()

            if (commission.payments.length && !commission.refunded && !unlocked) {
                let refund_phase = new CommissionPhase({
                    type: CommissionPhaseT.refund,
                    commission: commission._id,
                    done: false,
                    user: to_user_id,
                })
                refund_phase.save()
            }
        }
    })

    queue.process(TASK.commission_request_deadline, async job => {
        log.debug(`processing ${TASK.commission_request_deadline}`)
        const {
            commission_id,
        } = job.data as TaskDataTypeMap<TASK.commission_request_deadline>

        const comm = await Commission.findById(commission_id)

        if (!comm.finished && !comm.accepted) {
            // TODO: expire commission
        }

    })

    return r
}
