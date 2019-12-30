import { METHOD_NOT_ALLOWED, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { AggregrateType } from '@server/constants'
import { get_commissions_count } from '@services/aggregates'

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        if (['post'].includes(req.method)) {
            const { type, page, limit } = req.json

            try {
                if (type === AggregrateType.user_commissions_count) {
                    return res.status(OK).json(data_message(await get_commissions_count(req.user, ))
                }
            } catch (err) {
                return res.status(BAD_REQUEST).json(error_message(err))
            }
        

            return res.status(BAD_REQUEST).json(error_message("no valid analytics type"))
        }


        return res.status(METHOD_NOT_ALLOWED).json(error_message(''))
    }
)
