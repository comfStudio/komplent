import React from 'react'

import CommissionPage from '@components/App/CommissionPage'
import CommissionLayout from '@components/Commission/CommissionLayout'
import CommissionProcess from '@components/Commission/CommissionProcess'
import CommissionProducts from '@components/Commission/CommissionProducts'

class Page extends CommissionPage {
    render() {
        return this.renderPage(
            <CommissionLayout activeKey="products">
                <CommissionProducts />
            </CommissionLayout>
        )
    }
}

export default Page
