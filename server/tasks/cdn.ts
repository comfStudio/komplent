import { TASK, EVENT, TaskDataTypeMap, UploadType } from '@server/constants'
import { Event, Image, Attachment, Gallery } from '@db/models'
import log from '@utility/log'
import { upload_file, delete_file, generate_image_sizes } from '@services/aws'
import path from 'path'
import fs from 'fs'

export default function(queue) {
    let r = [
        TASK.cdn_upload,
        TASK.cdn_delete,
        TASK.gallery_upload
    ].reduce((a, v) => {
        let d = { ...a }
        d[v] = queue
        return d
    }, {} as any)

    queue.process(TASK.cdn_upload, async job => {
        log.debug(`processing ${TASK.cdn_upload}`)
        let { local_path, name, file_id, type, upload_type } = job.data as TaskDataTypeMap<
            TASK.cdn_upload
        >
        const set_name = name ? false : true

        if (fs.existsSync(local_path)) {
            let obj

            if (type === 'Image') {
                obj = await Image.findById(file_id)

                if (obj) {
                    const results = await generate_image_sizes(local_path, { name: path.basename(local_path), upload: true, type: upload_type})
                    if (set_name) {
                        obj.name = name
                    }
                    for (let r of results) {
                        if (r.data) {
                            obj.paths.push({...r.data, size: r.size})
                        }
                    }
                    obj.save()
                }
                

            } else if (type === 'Attachment') {
                obj = await Attachment.findById(file_id)
                
                if (obj) {

                    const filestream = fs.createReadStream(local_path)

                    let r
                    try {
                        r = await upload_file(filestream, path.basename(local_path))
                    } finally {
                        filestream.destroy()
                    }
                    const p = { url: r.Location, key: r.Key }
                    if (set_name) {
                        obj.name = name
                    }
                    obj.set(p)
                    obj.save()
                }
            }
        }
    })

    queue.process(TASK.gallery_upload, async job => {
        log.debug(`processing ${TASK.gallery_upload}`)
        let { local_path, name, gallery_id } = job.data as TaskDataTypeMap<
            TASK.gallery_upload
        >
        if (fs.existsSync(local_path)) {

            let gallery = await Gallery.findById(gallery_id)

            if (gallery) {
                let obj = new Image({user:gallery.user, name, paths: []})

                const results = await generate_image_sizes(local_path, { name: path.basename(local_path), upload: true, type: UploadType.Gallery})
                
                for (let r of results) {
                    if (r.data) {
                        obj.paths.push({...r.data, size: r.size})
                    }
                }

                await obj.save()
                gallery.image = obj
                gallery.save()
            }
        }
    })

    queue.process(TASK.cdn_delete, async job => {
        log.debug(`processing ${TASK.cdn_delete}`)
        let { key } = job.data as TaskDataTypeMap<TASK.cdn_delete>

        if (key) {
            await delete_file(key)
        }
    })

    return r
}
