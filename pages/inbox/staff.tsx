import React from 'react'

import InboxPage from '@components/App/InboxPage'
import InboxLayout from "@components/Inbox/InboxLayout"
import { Inbox } from '@store/inbox'


class StaffInboxPage extends InboxPage {

  static activeKey: Inbox = "staff"

  public render() {
    return this.renderPage(
      <InboxLayout activeKey={StaffInboxPage.activeKey}/>
    )
  }
}

export default StaffInboxPage
