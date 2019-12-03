import React, { Component } from 'react'
import { Grid, Row, Col } from 'rsuite'

import EarningsPage from '@components/App/EarningsPage'
import { EarningsKey } from '@store/earnings'
import EarningsLayout from '@components/Earnings/EarningsLayout'
import { RequireCreator } from '@components/Profile'
import { CommissionsMonthBarChart, EarningsMonthBarChart, EarningsMonthTable } from '@components/Earnings/Charts'
import { t } from '@app/utility/lang'

class HistoryPage extends EarningsPage {

    static activeKey: EarningsKey = 'history'

    render() {
        return this.renderPage(
            <EarningsLayout activeKey={HistoryPage.activeKey}>
                <RequireCreator />
                <Grid fluid>
                    <Row>
                        <Col>
                            <h3>{t`Commissions the past 12 months`}</h3>
                            <CommissionsMonthBarChart/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h3>{t`Earnings these past 12 months`}</h3>
                            <EarningsMonthBarChart/>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col>
                            <EarningsMonthTable/>
                        </Col>
                    </Row>
                </Grid>
            </EarningsLayout>
        )
    }
}

export default HistoryPage
