import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout } from '@components/Profile'
import ProfileIndex from '@components/Profile/ProfileIndex'

class IndexPage extends ProfilePage {
    public render() {
        return this.renderPage(
            <ProfileLayout activeKey="index">
                <ProfileIndex />
            </ProfileLayout>
        )
    }
}

export default IndexPage
