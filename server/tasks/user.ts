import { TASK, EVENT, TaskDataTypeMap } from '@server/constants'
import { Event } from '@db/models'
import log from '@utility/log'

export default function(queue) {
    let r = [
        TASK.user_commission_status_changed,
        TASK.user_notice_changed,
        TASK.activate_email,
        TASK.reset_login,
        TASK.followed_user,
    ].reduce((a, v) => {
        let d = { ...a }
        d[v] = queue
        return d
    }, {} as any)

    queue.process(TASK.user_commission_status_changed, async job => {
        log.debug(`processing ${TASK.user_commission_status_changed}`)
        const { user_id, status } = job.data as TaskDataTypeMap<
            TASK.user_commission_status_changed
        >
        let e = new Event({
            type: EVENT.changed_commission_status,
            from_user: user_id,
            data: { status },
        })
        await e.save()
    })

    queue.process(TASK.user_notice_changed, async job => {
        log.debug(`processing ${TASK.user_notice_changed}`)
        const { user_id, message } = job.data as TaskDataTypeMap<
            TASK.user_notice_changed
        >
        if (message) {
            let e = new Event({
                type: EVENT.notice_changed,
                from_user: user_id,
                data: { message },
            })
            await e.save()
        }
    })

    queue.process(TASK.followed_user, async job => {
        log.debug(`processing ${TASK.followed_user}`)
        const { user_id, followee } = job.data as TaskDataTypeMap<
            TASK.followed_user
        >
        let e = new Event({
            type: EVENT.followed_user,
            from_user: user_id,
            data: { followee },
        })
        await e.save()
    })

    queue.process(TASK.activate_email, async job => {})

    queue.process(TASK.reset_login, async job => {})

    return r
}
