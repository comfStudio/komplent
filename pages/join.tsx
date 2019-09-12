import React from 'react'

import { InverseAuthPage } from '@components/App/AuthPage'
import { MainLayout, Container} from '@app/components/App/MainLayout'
import JoinForm from '@components/Form/JoinForm'


class JoinPage extends InverseAuthPage {
  public render() {
    return this.renderPage(
      <MainLayout activeKey="join">
        <Container padded={16}>
          <JoinForm panel/>
        </Container>
      </MainLayout>
    )
  }
}

export default JoinPage
