import { TASK, EVENT, TaskDataTypeMap } from '@server/constants'
import { Event, User } from '@db/models'
import log from '@utility/log'
import { send_email, Template } from '@services/email'
import * as pages from '@utility/pages'
import { jwt_sign } from '@server/misc'
import CONFIG from '@server/config'

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

    queue.process(TASK.activate_email, async job => {
        log.debug(`processing ${TASK.activate_email}`)
        const { user_id } = job.data as TaskDataTypeMap<
            TASK.activate_email
        >
        const user = await User.findById(user_id)
        if (!user.email_verified) {

            const jwt_token = jwt_sign({
                user_id: user._id,
                email: user.email,
                type: "email",
            }, 60 * 60 * 24) // 1 day // in seconds

            send_email({
                template: Template.confirm_email,
                to: user,
                user,
                locals: {
                    confirm_url: pages.build_url(pages.confirm, {token: jwt_token})
                }
            })
        }
    })

    queue.process(TASK.reset_login, async job => {})

    return r
}
