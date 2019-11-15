import React from 'react'
import { NextPageContext } from 'next'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout, RequireOwnProfile } from '@components/Profile'
import ProfileEdit from '@components/Profile/ProfileEdit'
import { fetch_database_text } from '@server/misc'

class EditPage extends ProfilePage {

    static async getInitialProps(ctx: NextPageContext) {

      const props = await super.getInitialProps(ctx)

      const key = 'about'
      if (props.useUserState.current_user) {
        props.useUserState.current_user[key] = await fetch_database_text(props.useUserState.current_user[key])
      }

      return {
          ...props,
      }
      
    }

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
