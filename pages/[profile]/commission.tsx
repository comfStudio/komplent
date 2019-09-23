import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout, RequireOwnProfileInverse } from '@components/Profile'
import { ProfileCommission } from '@components/Profile/ProfileCommission'

class CommissionPage extends ProfilePage {
    public render() {
      return this.renderPage(
        <ProfileLayout activeKey="commission">
          <RequireOwnProfileInverse/>
          <ProfileCommission/>
        </ProfileLayout>
      )
    }
  }

export default CommissionPage
