import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout } from '@components/Profile'
import { ProfileCommission } from '@components/Profile/ProfileCommission'

class CommissionPage extends ProfilePage {
    public render() {
      return this.renderPage(
        <ProfileLayout activeKey="commission">
            <ProfileCommission/>
        </ProfileLayout>
      )
    }
  }

export default CommissionPage
