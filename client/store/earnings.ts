import { createStore } from '@client/store'
import { is_server } from '@utility/misc'
import { fetch } from '@utility/request'
import log from '@utility/log'
import * as pages from '@utility/pages'
import { AnalyticsType } from '@server/constants'

export type EarningsKey = 'payout' | 'history' | 'status'

export const useEarningsStore = createStore(
    {
        activeKey: undefined as EarningsKey,
    },
    {
        fetch_data(type: AnalyticsType, page = 0, limit = 30) {
            return fetch(pages.analytics, {
                method: 'post',
                auth: true,
                body: {
                    type,
                    page,
                    limit
                }
            })
        },
        async get_day_commission_data_per_rate(page = 0, limit = 30) {
            let r = await this.fetch_data(AnalyticsType.commissions_day, page, limit)
            return (await r.json())?.data ?? []
        },
        async get_month_commission_data(page = 0, limit = 30) {
            let r = await this.fetch_data(AnalyticsType.commissions_month, page, limit)
            return (await r.json())?.data ?? []
        },
        async get_day_commission_count_data(page = 0, limit = 100) {
            let r = await this.fetch_data(AnalyticsType.commissions_day_count, page, limit)
            return (await r.json())?.data ?? []
        },
        async get_month_commission_count_data(page = 0, limit = 100) {
            let r = await this.fetch_data(AnalyticsType.commissions_month_count, page, limit)
            return (await r.json())?.data ?? []
        },
        async get_day_commission_earnings_data(page = 0, limit = 100) {
            let r = await this.fetch_data(AnalyticsType.commissions_day_earnings, page, limit)
            return (await r.json())?.data ?? []
        },
        async get_month_commission_earnings_data() {
            let r = await this.fetch_data(AnalyticsType.commissions_month_earnings)
            return (await r.json())?.data ?? []
        },
        async get_month_earnings() {
            let r = await this.fetch_data(AnalyticsType.user_month_earnings)
            return (await r.json())?.data ?? 0
        },
    }
)

export default useEarningsStore
