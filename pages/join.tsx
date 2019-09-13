import React from 'react'

import { MainLayout, Container} from '@components/App/MainLayout'
import JoinForm from '@components/Form/JoinForm'
import { NoLoginPage } from '@components/User/Auth'


const JoinPage = () => {
  return (
      <MainLayout activeKey="join">
        <NoLoginPage/>
        <Container padded={16}>
          <JoinForm panel/>
        </Container>
      </MainLayout>
  )
}

export default JoinPage
