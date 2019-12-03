import React from 'react'

import CommissionsPage from '@components/App/CommissionsPage'
import CommissionsLayout from '@components/Commissions/CommissionsLayout'
import CommissionsListing from '@components/Commissions/CommissionsListing'

class Page extends CommissionsPage {
    render() {
        return this.renderPage(
            <CommissionsLayout activeKey="user">
                <CommissionsListing />
            </CommissionsLayout>
        )
    }
}

export default Page
