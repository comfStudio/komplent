import { createStore } from '@client/store'
import { is_server } from '@utility/misc'
import { fetch } from '@utility/request'
import log from '@utility/log'
import * as pages from '@utility/pages'
import { AnalyticsType } from '@server/constants'

export const useProfileStore = createStore(
    {
    },
    {
        fetch_data(user_id, type: AnalyticsType) {
            return fetch(pages.profile_stats, {
                method: 'post',
                body: {
                    user_id,
                    type,
                }
            })
        },
        async get_approval_stats(user_id) {
            let r = await this.fetch_data(user_id, AnalyticsType.commission_approval)
            return (await r.json())?.data ?? []
        },
        async get_completion_stats(user_id) {
            let r = await this.fetch_data(user_id, AnalyticsType.commission_completion)
            return (await r.json())?.data ?? []
        },
    }
)

export default useProfileStore
