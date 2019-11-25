import React, { Component } from 'react'

import EarningsPage from '@components/App/EarningsPage'
import { EarningsKey } from '@store/earnings'
import EarningsLayout from '@components/Earnings/EarningsLayout'

class HistoryPage extends EarningsPage {
    static activeKey: EarningsKey = 'history'

    render() {
        return this.renderPage(
            <EarningsLayout activeKey={HistoryPage.activeKey}></EarningsLayout>
        )
    }
}

export default HistoryPage
