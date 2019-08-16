import React from 'react'
import { Layout, Empty } from 'antd';

import MainLayout from '@app/components/App/MainLayout'


class SettingsPage extends React.Component {
  public render() {
    return (
      <MainLayout selectedKeys={["settings"]}>
      </MainLayout>
    )
  }
}

export default SettingsPage
