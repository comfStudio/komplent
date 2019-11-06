import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout, RequireOwnProfileInverse } from '@components/Profile'
import { ProfileCommission } from '@components/Profile/ProfileCommission'
import { NextPageContext } from 'next'
import { NOT_FOUND } from 'http-status-codes'

class CommissionPage extends ProfilePage {

    static async getInitialProps(ctx: NextPageContext) {
      const props = await super.getInitialProps(ctx)
      let error
      if (!props.profile_user?.commissions_open) {
        error = NOT_FOUND
        ctx.res.statusCode = error
      }

      return {
        ...props,
        error
      }
    }

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
