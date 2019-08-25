import React from 'react'

import { MainLayout, Container} from '@app/components/App/MainLayout'
import { LoginForm } from '@components/Login'


class LoginPage extends React.Component {
  public render() {
    return (
      <MainLayout activeKey="login">
        <Container padded={16}>
          <LoginForm panel/>
        </Container>
      </MainLayout>
    )
  }
}

export default LoginPage
