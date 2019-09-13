import React from 'react'

import { MainLayout, Container} from '@components/App/MainLayout'
import LoginForm from '@components/Form/LoginForm'
import { NoLoginPage } from '@components/User/Auth'

const LoginPage = () => {
  return (
      <MainLayout noSidebar activeKey="login">
        <NoLoginPage/>
        <Container padded={16}>
          <LoginForm panel/>
        </Container>
      </MainLayout>
  )
}

export default LoginPage
