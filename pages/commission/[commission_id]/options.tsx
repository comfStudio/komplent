import React from 'react'

import CommissionPage from '@components/App/CommissionPage'
import CommissionLayout from '@components/Commission/CommissionLayout'
import CommissionOptions from '@components/Commission/CommissionOptions'

class Page extends CommissionPage {
    static allow_owner = false

    render() {
        return this.renderPage(
            <CommissionLayout activeKey="options">
                <CommissionOptions />
            </CommissionLayout>
        )
    }
}

export default Page
