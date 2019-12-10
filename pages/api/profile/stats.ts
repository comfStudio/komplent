import { METHOD_NOT_ALLOWED, OK, BAD_REQUEST, NOT_FOUND } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import {
    ExApiRequest,
    ExApiResponse,
    with_middleware,
} from '@server/middleware'
import { AnalyticsType } from '@server/constants'
import {  get_approval_stats, get_completion_stats } from '@services/analytics'
import { User } from '@db/models'

export default with_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        if (['post'].includes(req.method)) {
            const { type, user_id } = req.json

            const user = await User.findById(user_id)
            if (!user) {
                return res.status(NOT_FOUND).json(error_message("profile not found"))
            }

            try {
                if (type === AnalyticsType.commission_approval) {
                    return res.status(OK).json(data_message(await get_approval_stats(user)))
                } else if (type === AnalyticsType.commission_completion) {
                    return res.status(OK).json(data_message(await get_completion_stats(user)))
                }
            } catch (err) {
                return res.status(BAD_REQUEST).json(error_message(err))
            }
        

            return res.status(BAD_REQUEST).json(error_message("no valid analytics type"))
        }


        return res.status(METHOD_NOT_ALLOWED).json(error_message(''))
    }
)
