import { TASK, EVENT, TaskDataTypeMap } from '@server/constants'
import { Event } from '@db/models'
import log from '@utility/log';

export default function(queue) {

    queue.process(TASK.user_commission_status_changed, async job => {
      log.debug(`processing ${TASK.user_commission_status_changed}`)
      const { user_id, status } = job.data as TaskDataTypeMap<TASK.user_commission_status_changed>
      let e = new Event({
          type: EVENT.changed_commission_status,
          from_user: user_id,
          data: status
      })
      await e.save()
    });
  
    queue.process(TASK.activate_email, async job => {
    });

    queue.process(TASK.reset_login, async job => {
    });

    let r = [
      TASK.user_commission_status_changed,
      TASK.activate_email,
      TASK.reset_login,
    ].reduce((a, v) => {
      let d = {...a}
        d[v] = queue
      return d
    }, {} as any)

    return r
  }