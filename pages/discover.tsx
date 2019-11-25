import React, { Component } from 'react'

import MainLayout from '@components/App/MainLayout'
import DiscoverLayout from '@components/Discover/DiscoverLayout'
import { OptionalAuthPage } from '@components/App/AuthPage'

class DiscoverPage extends OptionalAuthPage {
    render() {
        return this.renderPage(
            <MainLayout activeKey="discover">
                <DiscoverLayout />
            </MainLayout>
        )
    }
}

export default DiscoverPage
