import React from 'react'

import AuthPage from '@components/App/AuthPage'
import { ProfileLayout } from '@components/Profile'
import ProfileIndex from '@components/Profile/ProfileIndex'

class IndexPage extends AuthPage {
  public render() {
    return this.renderPage(
      <ProfileLayout activeKey="index">
        <ProfileIndex/>
      </ProfileLayout>
    )
  }
}

export default IndexPage
