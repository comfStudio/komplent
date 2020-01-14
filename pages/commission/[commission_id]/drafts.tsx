import React from 'react'

import CommissionPage from '@components/App/CommissionPage'
import CommissionLayout from '@components/Commission/CommissionLayout'
import CommissionAssets from '@components/Commission/CommissionAssets'

class Page extends CommissionPage {
    render() {
        return this.renderPage(
            <CommissionLayout activeKey="drafts">
                <CommissionAssets />
            </CommissionLayout>
        )
    }
}

export default Page
