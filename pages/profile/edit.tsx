import React from 'react'

import AuthPage from '@components/App/AuthPage'
import { ProfileLayout } from '@components/Profile'

class EditPage extends AuthPage {
    public render() {
      return this.renderPage(
        <ProfileLayout activeKey="edit">
        </ProfileLayout>
      )
    }
  }

export default EditPage
