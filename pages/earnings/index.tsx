import React, { Component } from 'react'

import EarningsPage from '@components/App/EarningsPage'
import { EarningsKey } from '@store/earnings'
import EarningsLayout from '@components/Earnings/EarningsLayout'

class Page extends EarningsPage {
    static activeKey: EarningsKey = 'status'

    render() {
        return this.renderPage(
            <EarningsLayout activeKey={Page.activeKey}></EarningsLayout>
        )
    }
}

export default Page
