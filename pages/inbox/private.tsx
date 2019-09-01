import React from 'react'
import MainLayout from '@app/components/App/MainLayout'
import InboxLayout from "@components/Inbox/InboxLayout"


class PrivateInboxPage extends React.Component {
  public render() {
    return (
      <InboxLayout activeKey="private"/>
    )
  }
}

export default PrivateInboxPage
