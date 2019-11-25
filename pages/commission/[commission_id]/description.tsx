import React from 'react'

import CommissionPage from '@components/App/CommissionPage'
import CommissionLayout from '@components/Commission/CommissionLayout'
import CommissionProcess from '@components/Commission/CommissionProcess'
import CommissionDescription from '@components/Commission/CommissionDescription'

class Page extends CommissionPage {
    render() {
        return this.renderPage(
            <CommissionLayout activeKey="description">
                <CommissionDescription />
            </CommissionLayout>
        )
    }
}

export default Page
