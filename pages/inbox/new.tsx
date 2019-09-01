import React from 'react'
import MainLayout from '@app/components/App/MainLayout'
import InboxLayout from "@components/Inbox/InboxLayout"


class NewInboxPage extends React.Component {
  public render() {
    return (
      <InboxLayout activeKey="new"/>
    )
  }
}

export default NewInboxPage
