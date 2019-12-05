import { METHOD_NOT_ALLOWED, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { AnalyticsType } from '@server/constants'
import { get_commissions, get_commissions_count, get_commissions_earnings_per_rate as get_commissions_earnings, get_earnings, get_commissions_earnings_per_date, get_commissions_by_date, get_payout_balance } from '@services/analytics'
import { startOfMonth, startOfYear, subYears, subMonths } from 'date-fns'

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        if (['post'].includes(req.method)) {
            const { type, page, limit } = req.json

            try {
                if (type === AnalyticsType.commissions_day) {
                    return res.status(OK).json(data_message(await get_commissions(req.user, subMonths(new Date(), 1), page ?? 0, limit ?? 30)))
                } else if (type === AnalyticsType.commissions_day_count) {
                    return res.status(OK).json(data_message(await get_commissions_count(req.user, startOfMonth(new Date()), page ?? 0, limit ?? 30, {by_day: true, by_month: true})))
                } else if (type === AnalyticsType.commissions_month_count) {
                    return res.status(OK).json(data_message(await get_commissions_count(req.user, startOfYear(new Date()), page ?? 0, limit ?? 30, {by_day: false, by_month: true})))
                } else if (type === AnalyticsType.commissions_day_earnings) {
                    return res.status(OK).json(data_message(await get_commissions_earnings(req.user, startOfMonth(new Date()), page ?? 0, limit ?? 30)))
                } else if (type === AnalyticsType.user_month_earnings) {
                    return res.status(OK).json(data_message(await get_earnings(req.user, startOfMonth(new Date()))))
                } else if (type === AnalyticsType.commissions_month_earnings) {
                    return res.status(OK).json(data_message(await get_commissions_earnings_per_date(req.user, subYears(new Date(), 1), {by_day: false, by_month: true})))
                } else if (type === AnalyticsType.commissions_month) {
                        return res.status(OK).json(data_message(await get_commissions_by_date(req.user, subYears(new Date(), 1), page ?? 0, limit ?? 30, {by_day: false, by_month: true})))
                } else if (type === AnalyticsType.user_payout_balance) {
                    return res.status(OK).json(data_message(await get_payout_balance(req.user)))
                }
            } catch (err) {
                return res.status(BAD_REQUEST).json(error_message(err))
            }
        

            return res.status(BAD_REQUEST).json(error_message("no valid analytics type"))
        }


        return res.status(METHOD_NOT_ALLOWED).json(error_message(''))
    }
)
