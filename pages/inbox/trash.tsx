import React from 'react'

import InboxPage from '@components/App/InboxPage'
import InboxLayout from "@components/Inbox/InboxLayout"
import { InboxKey } from '@store/inbox'


class TrashInboxPage extends InboxPage {

  static activeKey: InboxKey = "trash"

  public render() {
    return this.renderPage(
      <InboxLayout activeKey={TrashInboxPage.activeKey}/>
    )
  }
}

export default TrashInboxPage
