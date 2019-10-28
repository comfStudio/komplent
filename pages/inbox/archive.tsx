import React from 'react'

import AuthPage from '@components/App/AuthPage'
import InboxLayout from "@components/Inbox/InboxLayout"


class ArchiveInboxPage extends AuthPage {
  public render() {
    return this.renderPage(
      <InboxLayout activeKey="archive"/>
    )
  }
}

export default ArchiveInboxPage
