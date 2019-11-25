import React, { Component } from 'react'

import MainLayout from '@components/App/MainLayout'
import SearchLayout from '@components/Search/SearchLayout'
import SearchPage from '@components/App/SearchPage'

class Page extends SearchPage {
    render() {
        return this.renderPage(
            <MainLayout activeKey="search">
                <SearchLayout />
            </MainLayout>
        )
    }
}

export default Page
