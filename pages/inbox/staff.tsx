import React from 'react'
import MainLayout from '@app/components/App/MainLayout'
import InboxLayout from "@components/Inbox/InboxLayout"


class StaffInboxPage extends React.Component {
  public render() {
    return (
      <InboxLayout activeKey="staff"/>
    )
  }
}

export default StaffInboxPage
