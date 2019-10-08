import { TASK, EVENT } from '@server/constants'
import { Event } from '@db/models'

export default function(queue) {

    queue.process(TASK.user_commission_status_changed, async job => {
      const { user_id, status } = job.attrs.data
      let e = new Event({
          type: EVENT.commission_status,
          from_user: user_id,
          data: status
      })
      await e.save()
    });
  
    queue.process(TASK.activate_email, async job => {
    });

    queue.process(TASK.reset_login, async job => {
    });

    return [
      TASK.user_commission_status_changed,
      TASK.activate_email,
      TASK.reset_login,
    ].reduce((a, v) => ({...a, v:queue}), {})
  
  }