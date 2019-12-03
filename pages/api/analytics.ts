import { METHOD_NOT_ALLOWED, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { AnalyticsType } from '@server/constants'
import { get_commissions, get_commissions_count, get_commissions_earnings, get_earnings } from '@services/analytics'
import { startOfMonth, startOfYear } from 'date-fns'

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        if (['post'].includes(req.method)) {
            const { type, page, limit } = req.json

            try {
                if (type === AnalyticsType.commissions_day) {
                    return res.status(OK).json(data_message(await get_commissions(req.user, startOfMonth(new Date()), page ?? 0, limit ?? 30)))
                } else if (type === AnalyticsType.commissions_day_count) {
                    return res.status(OK).json(data_message(await get_commissions_count(req.user, startOfMonth(new Date()), page ?? 0, limit ?? 30)))
                } else if (type === AnalyticsType.commissions_day_earnings) {
                    return res.status(OK).json(data_message(await get_commissions_earnings(req.user, startOfMonth(new Date()), page ?? 0, limit ?? 30)))
                } else if (type === AnalyticsType.month_earnings) {
                    return res.status(OK).json(data_message(await get_earnings(req.user, startOfMonth(new Date()))))
                }
            } catch (err) {
                return res.status(BAD_REQUEST).json(error_message(err))
            }
        

            return res.status(BAD_REQUEST).json(error_message("no valid analytics type"))
        }


        return res.status(METHOD_NOT_ALLOWED).json(error_message(''))
    }
)
