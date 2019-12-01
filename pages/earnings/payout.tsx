import React, { Component } from 'react'

import { Grid, Row, Col } from 'rsuite'

import EarningsPage from '@components/App/EarningsPage'
import { EarningsKey } from '@store/earnings'
import EarningsLayout from '@components/Earnings/EarningsLayout'
import { RequireCreator } from '@components/Profile'
import { t } from '@app/utility/lang'
import { PayoutHistoryTable } from '@components/Earnings/Charts'
import { PayoutBalance } from '@components/Earnings/Payout'

class PayoutPage extends EarningsPage {
    static activeKey: EarningsKey = 'payout'

    render() {
        return this.renderPage(
            <EarningsLayout activeKey={PayoutPage.activeKey}>
                <RequireCreator/>
                <Grid fluid>
                    <Row>
                        <Col xs={8}>
                            <PayoutBalance/>
                        </Col>
                    </Row>
                    <Row>
                        <h3>{t`Payout History`}</h3>
                        <Col xs={24}>
                            <PayoutHistoryTable/>
                        </Col>
                    </Row>
                </Grid>
            </EarningsLayout>
        )
    }
}

export default PayoutPage
