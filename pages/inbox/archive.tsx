import React from 'react'

import InboxPage from '@components/App/InboxPage'
import InboxLayout from "@components/Inbox/InboxLayout"
import { Inbox } from '@store/inbox'


class ArchiveInboxPage extends InboxPage {

  static activeKey: Inbox = "archive"

  public render() {
    return this.renderPage(
      <InboxLayout activeKey={ArchiveInboxPage.activeKey}/>
    )
  }
}

export default ArchiveInboxPage
