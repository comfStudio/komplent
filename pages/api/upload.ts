import formidable from 'formidable'
import { METHOD_NOT_ALLOWED, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { create_file } from '@services/general'
import log from '@utility/log'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        if (['post', 'put'].includes(req.method)) {
            const form = new formidable.IncomingForm()
            form.encoding = 'utf-8'
            form.keepExtensions = true
            form.maxFileSize = 10 * 1024 * 1024 // 10mb

            return form.parse(req, (err, fields, files) => {
                if (files.file && !err) {
                    create_file(fields.type, fields.user, files.file.path, files.file.name, {extra_data: fields.extra_data, upload_type: fields.upload_type})
                        .then(im => {
                            return res
                                .status(OK)
                                .json(data_message(im.toJSON()))
                        })
                        .catch(r => {
                            log.error(r)
                            return res
                                .status(BAD_REQUEST)
                                .json(error_message(r))
                        })
                } else {
                    return res.status(BAD_REQUEST).json(error_message(err))
                }
            })
        }

        return res.status(METHOD_NOT_ALLOWED).json(error_message(''))
    }
)
