import bodybuilder from 'bodybuilder'

import { createStore } from '@client/store'
import { User, Conversation, Message } from '@db/models'
import { is_server, promisify_es_search } from '@utility/misc'
import { fetch } from '@utility/request'
import { update_db } from '@client/db'
import { conversation_schema, message_schema } from '@schema/message'
import log from '@utility/log'

export type EarningsKey = 'payout' | 'history' | 'status'

export const useEarningsStore = createStore(
    {
        activeKey: undefined as EarningsKey,
    },
    {}
)

export default useEarningsStore
