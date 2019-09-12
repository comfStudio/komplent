import React from 'react'

import AuthPage from '@components/App/AuthPage'
import InboxLayout from "@components/Inbox/InboxLayout"


class NewInboxPage extends AuthPage {
  public render() {
    return this.renderPage(
      <InboxLayout activeKey="new"/>
    )
  }
}

export default NewInboxPage
