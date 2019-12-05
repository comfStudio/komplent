import { createStore } from '@client/store'
import { is_server } from '@utility/misc'
import { fetch } from '@utility/request'
import log from '@utility/log'
import * as pages from '@utility/pages'
import { AnalyticsType } from '@server/constants'
import { Payout } from '@db/models'
import { get_payout_balance } from '@services/analytics'

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

export const usePayoutStore = createStore(
    {
        payouts: [] as any[],
        balance: undefined as any,
    },{
        async load(user) {

            let state = {
                payouts: [],
                balance: undefined
            }

            const q = { user }
            const s = { from_date: -1 }
            if (is_server()) {
                try {
                    state.payouts = await Payout.find(q).sort(s).lean()
                    state.balance = await get_payout_balance(user)

                } catch (err) {
                    log.error(err)
                    return null
                }
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Payout',
                        method: 'find',
                        query: q,
                        sort: s
                    },
                }).then(async r => {
                    if (r.ok) {
                        state.payouts = (await r.json()).data
                    }
                })

                await fetch(pages.analytics, {
                    method: 'post',
                    auth: true,
                    body: {
                        type: AnalyticsType.user_payout_balance,
                    }
                }).then(async r => {
                    if (r.ok) {
                        state.balance = (await r.json()).data
                    }
                })
            }

            return state
        },
    }
)

export default useEarningsStore
