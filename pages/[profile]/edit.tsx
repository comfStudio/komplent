import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout, RequireOwnProfile } from '@components/Profile'
import ProfileEdit from '@components/Profile/ProfileEdit'

class EditPage extends ProfilePage {
    public render() {
      return this.renderPage(
        <ProfileLayout activeKey="edit">
          <RequireOwnProfile/>
          <ProfileEdit/>
        </ProfileLayout>
      )
    }
  }

export default EditPage
