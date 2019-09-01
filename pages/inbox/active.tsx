import React from 'react'
import MainLayout from '@app/components/App/MainLayout'
import InboxLayout from "@components/Inbox/InboxLayout"


class ActiveInboxPage extends React.Component {
  public render() {
    return (
      <InboxLayout activeKey="active"/>
    )
  }
}

export default ActiveInboxPage
