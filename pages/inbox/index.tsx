import React from 'react'

import InboxPage from '@components/App/InboxPage'
import InboxLayout from '@components/Inbox/InboxLayout'
import { InboxKey } from '@store/inbox'

class Page extends InboxPage {
    static activeKey: InboxKey = 'inbox'

    public render() {
        return this.renderPage(
            <InboxLayout activeKey={Page.activeKey} />
        )
    }
}

export default Page
