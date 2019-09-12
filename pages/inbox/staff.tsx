import React from 'react'

import AuthPage from '@components/App/AuthPage'
import InboxLayout from "@components/Inbox/InboxLayout"


class StaffInboxPage extends AuthPage {
  public render() {
    return this.renderPage(
      <InboxLayout activeKey="staff"/>
    )
  }
}

export default StaffInboxPage
