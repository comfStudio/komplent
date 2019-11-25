import React, { Component } from 'react'

import EarningsPage from '@components/App/EarningsPage'
import { EarningsKey } from '@store/earnings'
import EarningsLayout from '@components/Earnings/EarningsLayout'

class PayoutPage extends EarningsPage {
    static activeKey: EarningsKey = 'payout'

    render() {
        return this.renderPage(
            <EarningsLayout activeKey={PayoutPage.activeKey}></EarningsLayout>
        )
    }
}

export default PayoutPage
