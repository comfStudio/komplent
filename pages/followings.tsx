import React, { Component } from 'react'

import MainLayout from '@components/App/MainLayout'
import FollowLayout from '@components/Follow/FollowLayout'
import FollowPage, { TypeKey } from '@components/App/FollowPage'
import CreatorCard from '@components/User/CreatorCard'
import * as pages from '@utility/pages'

class Page extends FollowPage {

    static type: TypeKey = "follower"

    render() {
        return this.renderPage(
            <MainLayout activeKey="followings">
                <FollowLayout url={pages.followings} UserComponent = {CreatorCard} />
            </MainLayout>
        )
    }
}

export default Page
