import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout, RequireOwnProfile } from '@components/Profile'

class EditPage extends ProfilePage {
    public render() {
      return this.renderPage(
        <ProfileLayout activeKey="edit">
          <RequireOwnProfile/>
        </ProfileLayout>
      )
    }
  }

export default EditPage
