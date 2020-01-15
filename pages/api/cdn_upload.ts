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
import { upload_file } from '@services/aws'
import { Image, Attachment } from '@db/models'

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
            form.maxFileSize = 30 * 10 * 1024 * 1024 // 3mb

            return form.parse(req, (err, fields, files) => {
                if (files.file && !err) {
                    const filestream = fs.createReadStream(files.file.path)
                    upload_file(filestream, path.basename(files.file.path)).then(async r => {

                        res.status(OK).json(data_message({ url: r.Location, key: r.Key, name: files.file.name }))

                    }).catch(r => {
                        log.error(r)
                        return res
                            .status(BAD_REQUEST)
                            .json(error_message(r))
                    }).finally(() => {
                        filestream.destroy()
                    })

                } else {
                    return res.status(BAD_REQUEST).json(error_message(err))
                }
            })
        }

        return res.status(METHOD_NOT_ALLOWED).json(error_message('method not allowed'))
    }
)
