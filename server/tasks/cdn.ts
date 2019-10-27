import { TASK, EVENT, TaskDataTypeMap } from '@server/constants'
import { Event } from '@db/models'
import log from '@utility/log';

export default function(queue) {

    let r = [
      TASK.cdn_upload,
    ].reduce((a, v) => {
      let d = {...a}
        d[v] = queue
      return d
    }, {} as any)

    queue.process(TASK.cdn_upload, async job => {
      log.debug(`processing ${TASK.cdn_upload}`)
      const { image_id } = job.data as TaskDataTypeMap<TASK.cdn_upload>
    });

    return r
  }