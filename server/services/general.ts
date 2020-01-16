import fs from 'fs'
import path from 'path'

import { schedule_now } from '@server/tasks'
import { TASK } from '@server/constants'
import { Image, Attachment, Gallery } from '@db/models'
import { upload_file } from './aws'
import { user_among } from '@utility/misc'

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


export const add_gallery = async (user, file, extra_data = {}) => {

    if (user.type !== 'creator') {
        throw Error("user is not a creator")
    }

    const count = await Gallery.find({user}).countDocuments()
    if (count >= 10) {
        throw Error("limit reached")
    }
    
    const gallery = new Gallery({ user, ...extra_data })
    await gallery.save()

    schedule_now({
        task: TASK.gallery_upload,
        data: { gallery_id: gallery._id, local_path: file.path, name: file.name },
    })
    return gallery
}

export const delete_gallery = async (user, gallery_id) => {

    const gallery = await Gallery.findById(gallery_id)

    user_among(user, gallery?.user)

    await gallery.remove()

    return true
}