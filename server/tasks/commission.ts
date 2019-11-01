import { TASK, EVENT, TaskDataTypeMap } from '@server/constants'
import { Event } from '@db/models'
import log from '@utility/log';

export default function(queue) {

    let r = [
      TASK.commission_phase_updated,
    ].reduce((a, v) => {
      let d = {...a}
        d[v] = queue
      return d
    }, {} as any)

    queue.process(TASK.commission_phase_updated, async job => {
      log.debug(`processing ${TASK.commission_phase_updated}`)
      const { user_id, commission_id, phase, from_user_id, to_user_id } = job.data as TaskDataTypeMap<TASK.commission_phase_updated>
      let e = new Event({
          type: EVENT.commission_phase_updated,
          from_user: user_id,
          data: { phase, commission_id, from_user_id, to_user_id }
      })
      await e.save()
    });

    return r
  }