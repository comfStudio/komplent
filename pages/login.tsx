import React from 'react'
import { Layout, Empty } from 'rsuite';

import MainLayout from '@app/components/App/MainLayout'


class LoginPage extends React.Component {
  public render() {
    return (
      <MainLayout selectedKeys={["login"]}>
      </MainLayout>
    )
  }
}

export default LoginPage
