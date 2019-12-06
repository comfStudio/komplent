import { TASK, EVENT, TaskDataTypeMap } from '@server/constants'
import log from '@utility/log'
import { Payout } from '@db/models'

export default function(queue) {
    let r = [
        TASK.payout_user,
    ].reduce((a, v) => {
        let d = { ...a }
        d[v] = queue
        return d
    }, {} as any)

    queue.process(TASK.payout_user, async job => {
        log.debug(`processing ${TASK.payout_user}`)
        const { payout_id } = job.data as TaskDataTypeMap<
            TASK.payout_user
        >
        
        const p = await Payout.findById(payout_id)
        if (p) {
            p.status = "completed"
            p.save()
        }

    })

    return r
}
