import React from 'react'

import AuthPage from '@components/App/AuthPage'
import InboxLayout from "@components/Inbox/InboxLayout"


class TrashInboxPage extends AuthPage {
  public render() {
    return this.renderPage(
      <InboxLayout activeKey="trash"/>
    )
  }
}

export default TrashInboxPage
