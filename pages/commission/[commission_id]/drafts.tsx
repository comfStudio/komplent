import React from 'react'

import CommissionPage from '@components/App/CommissionPage'
import CommissionLayout from '@components/Commission/CommissionLayout'
import { CommissionDrafts } from '@components/Commission/CommissionAssets'

class Page extends CommissionPage {
    render() {
        return this.renderPage(
            <CommissionLayout activeKey="drafts">
                <CommissionDrafts />
            </CommissionLayout>
        )
    }
}

export default Page
