import React from 'react'

import InboxPage from '@components/App/InboxPage'
import InboxLayout from '@components/Inbox/InboxLayout'
import { InboxKey } from '@store/inbox'

class ArchiveInboxPage extends InboxPage {
    static activeKey: InboxKey = 'archive'

    public render() {
        return this.renderPage(
            <InboxLayout activeKey={ArchiveInboxPage.activeKey} />
        )
    }
}

export default ArchiveInboxPage
