import React from 'react'

import { ProfileLayout } from '@components/Profile'
import ProfileIndex from '@components/Profile/ProfileIndex'

export const IndexPage = (props) => {

    return (
      <ProfileLayout activeKey="index">
        <ProfileIndex/>
      </ProfileLayout>
    )
}

export default IndexPage
