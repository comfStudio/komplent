import { schedule_now } from '@server/tasks'
import { TASK } from '@server/constants'
import { Image } from '@db/models'

export const create_image = async (path: string, name: string = undefined) => {
    const im = new Image({ name: name })
    await im.save()
    schedule_now({
        task: TASK.cdn_upload,
        data: { image_id: im._id, local_path: path, name: name },
    })
    return im
}
