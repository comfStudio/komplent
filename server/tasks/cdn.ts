import { TASK, EVENT, TaskDataTypeMap } from '@server/constants'
import { Event, Image } from '@db/models'
import log from '@utility/log';
import { upload_file, delete_file } from '@services/aws';
import path from 'path';
import fs from 'fs';

export default function(queue) {

  let r = [
    TASK.cdn_upload,
    TASK.cdn_delete,
  ].reduce((a, v) => {
    let d = {...a}
      d[v] = queue
    return d
  }, {} as any)

  queue.process(TASK.cdn_upload, async job => {
    log.debug(`processing ${TASK.cdn_upload}`)
    let { local_path, name, image_id } = job.data as TaskDataTypeMap<TASK.cdn_upload>
    const set_name = name ? false : true
    if (!name) {
      name = path.basename(local_path)
    }

    if (fs.existsSync(local_path)) {
      
      const filestream = fs.createReadStream(local_path)
      let r

      try {
        r = await upload_file(filestream, name)
      } finally {
        filestream.destroy()
      }

      const im = await Image.findById(image_id)

      if (im) {
        const p = {url: r.Location, key: r.Key}
        if (im.paths) {
          im.paths = []
        }
        im.paths.push(p)
        im.save()
      }

    }
  });

  queue.process(TASK.cdn_delete, async job => {
    log.debug(`processing ${TASK.cdn_delete}`)
    let { key } = job.data as TaskDataTypeMap<TASK.cdn_delete>
    
    if (key) {
      await delete_file(key)
    }

  });

  return r
}