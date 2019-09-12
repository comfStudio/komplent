import React from 'react'

import AuthPage from '@components/App/AuthPage'
import { ProfileLayout } from '@components/Profile'

class ShopPage extends AuthPage {
    public render() {
      return this.renderPage(
        <ProfileLayout activeKey="shop">
        </ProfileLayout>
      )
    }
  }

export default ShopPage
