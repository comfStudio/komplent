import React, { Component } from 'react'

import MainLayout from '@components/App/MainLayout'
import FollowLayout from '@components/Follow/FollowLayout'
import FollowPage, { TypeKey } from '@components/App/FollowPage'
import UserCard from '@components/User/UserCard'
import * as pages from '@utility/pages'

class Page extends FollowPage {

    static type: TypeKey = "followee"

    render() {
        return this.renderPage(
            <MainLayout activeKey="followers">
                <FollowLayout url={pages.followers} UserComponent={UserCard} userComponentProps={{commissionCountData: this.props.followStoreState.commission_count}} />
            </MainLayout>
        )
    }
}

export default Page
