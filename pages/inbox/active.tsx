import React from 'react'

import InboxLayout from '@components/Inbox/InboxLayout'
import InboxPage from '@components/App/InboxPage'
import { InboxKey } from '@store/inbox'

class ActiveInboxPage extends InboxPage {
    static activeKey: InboxKey = 'active'

    public render() {
        return this.renderPage(
            <InboxLayout activeKey={ActiveInboxPage.activeKey} />
        )
    }
}

export default ActiveInboxPage
