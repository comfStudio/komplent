import React from 'react'

import { MainLayout, Container} from '@app/components/App/MainLayout'
import JoinForm from '@components/Form/JoinForm'


class JoinPage extends React.Component {
  public render() {
    return (
      <MainLayout activeKey="join">
        <Container padded={16}>
          <JoinForm panel/>
        </Container>
      </MainLayout>
    )
  }
}

export default JoinPage
