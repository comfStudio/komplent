import formidable from 'formidable'
import { METHOD_NOT_ALLOWED, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import log from '@utility/log'
import { delete_gallery } from '@services/general'

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        if (req.method === 'delete') {
            try {
                const { gallery_id } = req.json
                return res.status(OK).json(data_message(await delete_gallery(req.user, gallery_id)))

            } catch (err) {
                return res.status(BAD_REQUEST).json(error_message(err.message ?? err))
            }
        }

        return res.status(METHOD_NOT_ALLOWED).json(error_message(''))
    }
)
