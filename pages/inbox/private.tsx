import React from 'react'

import AuthPage from '@components/App/AuthPage'
import InboxLayout from "@components/Inbox/InboxLayout"


class PrivateInboxPage extends AuthPage {
  public render() {
    return this.renderPage(
      <InboxLayout activeKey="private"/>
    )
  }
}

export default PrivateInboxPage
