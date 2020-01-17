import formidable from 'formidable'
import { METHOD_NOT_ALLOWED, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import log from '@utility/log'
import { add_gallery } from '@services/general'

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

            return form.parse(req, async (err, fields, files) => {
                try {
                    if (err) {
                        throw Error(err)
                    }
                    if (files.file) {

                        add_gallery(req.user, files.file, fields.extra_data).then(r => {
                            return res.status(OK).json(data_message(r))
                        }).catch(err => {
                            log.error(err)
                            return res.status(BAD_REQUEST).json(error_message(err.message))
                        })

                    } else {
                        throw Error("no files")
                    }
                } catch (err) {
                    return res.status(BAD_REQUEST).json(error_message(err.message))
                }
            })
        }

        return res.status(METHOD_NOT_ALLOWED).json(error_message(''))
    }
)
