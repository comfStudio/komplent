import { schedule_now } from '@server/tasks'
import { TASK } from '@server/constants'
import { Image, Attachment } from '@db/models'

export const create_file = async (type: "Image" | "Attachment", user: any, path: string, name: string = undefined, extra_data = {}) => {
    const d = { name, user, ...extra_data }
    const obj = type === 'Image' ? new Image(d) : type === 'Attachment' ? new Attachment(d) : undefined
    await obj.save()
    schedule_now({
        task: TASK.cdn_upload,
        data: { file_id: obj._id, local_path: path, name: name, type },
    })
    return obj
}
