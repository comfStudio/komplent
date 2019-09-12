import React from 'react'

import AuthPage from '@components/App/AuthPage'
import { ProfileLayout } from '@components/Profile'
import { ProfileCommission } from '@components/Profile/ProfileCommission'

class CommissionPage extends AuthPage {
    public render() {
      return this.renderPage(
        <ProfileLayout activeKey="commission">
            <ProfileCommission/>
        </ProfileLayout>
      )
    }
  }

export default CommissionPage
