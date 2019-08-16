import React from 'react'
import { Layout, Empty } from 'antd';

import MainLayout from '@app/components/App/MainLayout'


class InboxPage extends React.Component {
  public render() {
    return (
      <MainLayout selectedKeys={["inbox"]}>
      </MainLayout>
    )
  }
}

export default InboxPage
