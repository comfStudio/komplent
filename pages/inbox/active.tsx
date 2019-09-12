import React from 'react'

import InboxLayout from "@components/Inbox/InboxLayout"
import AuthPage from '@components/App/AuthPage'


class ActiveInboxPage extends AuthPage {
  public render() {
    return this.renderPage(
      <InboxLayout activeKey="active"/>
    )
  }
}

export default ActiveInboxPage
