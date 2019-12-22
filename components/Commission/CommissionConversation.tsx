import React, { useState } from 'react'
import { Button } from 'rsuite'
import { useCommissionStore } from '@store/commission'
import { Conversation } from '@components/Inbox/InboxConversation'
import { CenterPanel } from '@components/App/MainLayout'
import { t } from '@app/utility/lang'

const CommissionConversation = () => {
    const store = useCommissionStore()
    const [loading, set_loading] = useState(false)

    return (
        <>
        {!!store.state.active_conversation &&
        <Conversation
            conversation={store.state.active_conversation}
            messages={store.state.messages}
            useStore={useCommissionStore}
            noHeader
            noBorder
        />
        }
        {!store.state.active_conversation && 
        <CenterPanel title={t`No conversation has been started yet`}>
            <Button appearance="primary" size="lg" className="mt-2" loading={loading} onClick={() => {
                set_loading(true)
                store.start_conversation().finally(() => set_loading(false))
            }}>{t`Start conversation`}</Button>
            </CenterPanel>}
        </>
    )
}

export default CommissionConversation
