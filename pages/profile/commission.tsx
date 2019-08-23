import React from 'react'

import { ProfileLayout } from '@components/Profile'
import { ProfileCommission } from '@components/Profile/ProfileCommission'

export const EditPage = (props) => {

    return (
        <ProfileLayout activeKey="commission">
            <ProfileCommission/>
        </ProfileLayout>
    )
}

export default EditPage
