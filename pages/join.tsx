import React from 'react'

import { MainLayout, Container} from '@components/App/MainLayout'
import JoinForm from '@components/Form/JoinForm'
import { InverseAuthPage } from '@components/App/AuthPage'

class JoinPage extends InverseAuthPage {

  render() {
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
