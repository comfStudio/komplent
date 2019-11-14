import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout, RequireOwnProfileInverse } from '@components/Profile'
import { ProfileCommission, CommissionsClosed, RequestsClosed } from '@components/Profile/ProfileCommission'
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
        error,
        optional: false
      }
    }

    public render() {

      let open = this.props.profile_user?.commissions_open ?? false
      if (open && this.props.slots_left < 1) {
        open = false
      }

      let req_open = false
      if (this.props.requests_count < this.props.profile_user?.ongoing_requests_limit ?? 0) {
        req_open = true
      }

      return this.renderPage(
        <ProfileLayout activeKey="commission">
          <RequireOwnProfileInverse/>
          {open && req_open && <ProfileCommission/>}
          {open && !req_open && <RequestsClosed/>}
          {!open && <CommissionsClosed/>}
        </ProfileLayout>
      )
    }
  }

export default CommissionPage
