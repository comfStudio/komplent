import { Event, User, Follow, Notification } from '@db/models'
import { EVENT } from '@server/constants'
import log from '@utility/log'

const get_followers = async user => {
    let f = await Follow.find({ followee: user._id, end: null })
        .populate('follower')
        .lean()
    f = f.map(v => v.follower)
    return f
}

const notify_followers = async (type, from_user, data) => {
    let f = await get_followers(from_user._id)
    for (let u of f) {
        let n = new Notification({
            type: type,
            from_user: from_user._id,
            to_user: u._id,
            data,
        })
        n.save()
    }
    log.debug(`Notified ${f.length} followers`)
}

const notify_user = async (
    type,
    from_user_id,
    to_user_id,
    data = undefined
) => {
    let n = new Notification({
        type: type,
        from_user: from_user_id,
        to_user: to_user_id,
        data,
    })
    n.save()
    log.debug(`Notified user`)
}

export async function setup_streams() {
    Event.watch().on('change', async data => {
        if (data.fullDocument) {
            let d = data.fullDocument
            log.debug(`Received event ${d.type}`)
            switch (d.type) {
                case EVENT.notice_changed:
                case EVENT.changed_commission_status: {
                    await notify_followers(d.type, d.from_user, d.data)
                    break
                }
                case EVENT.followed_user: {
                    await notify_user(d.type, d.from_user._id, d.data.followee)
                    break
                }
                case EVENT.commission_phase_updated: {
                    await notify_user(
                        d.type,
                        d.from_user,
                        d.from_user === d.data.from_user_id
                            ? d.data.to_user_id
                            : d.data.from_user_id,
                        d.data
                    )
                    break
                }
            }
        }
    })
}
