import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { METHOD_NOT_ALLOWED, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import log from '@utility/log'
import { upload_file, generate_image_sizes } from '@services/aws'
import { Image, Attachment } from '@db/models'
import { UploadType } from '@server/constants'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        if (['post'].includes(req.method)) {
            const form = new formidable.IncomingForm()
            form.encoding = 'utf-8'
            form.keepExtensions = true
            form.maxFileSize = 3 * 1024 * 1024 // 3mb

            return form.parse(req, (err, fields, files) => {
                if (files.file && !err) {
                    let p
                    let filestream
                    console.log(fields)
                    if (fields.type === 'Image') {
                        p = generate_image_sizes(files.file.path, {type: UploadType.Generic, name: files.file.name, upload: true})
                    } else {
                        filestream = fs.createReadStream(files.file.path)
                        p = upload_file(filestream, path.basename(files.file.path))
                    }

                    p.then(async r => {

                        if (Array.isArray(r)) {
                            r = r[0].data
                        } else {
                            r = { url: r.Location, key: r.Key }
                        }

                        res.status(OK).json(data_message({...r, name: files.file.name }))

                    }).catch(r => {
                        log.error(r)
                        return res
                            .status(BAD_REQUEST)
                            .json(error_message(r))
                    }).finally(() => {
                        if (filestream) {
                            filestream.destroy()
                        }
                    })

                } else {
                    return res.status(BAD_REQUEST).json(error_message(err))
                }
            })
        }

        return res.status(METHOD_NOT_ALLOWED).json(error_message('method not allowed'))
    }
)
