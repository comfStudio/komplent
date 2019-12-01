import React, { Component } from 'react'

import { Grid, Row, Col } from 'rsuite'
import CountUp from 'react-countup';

import EarningsPage from '@components/App/EarningsPage'
import { EarningsKey } from '@store/earnings'
import EarningsLayout from '@components/Earnings/EarningsLayout'
import { RequireCreator } from '@components/Profile'
import { DayLineChart, EarningsDaysPieChart, DayTable } from '@components/Earnings/Charts'
import { t } from '@app/utility/lang'

class Page extends EarningsPage {
    static activeKey: EarningsKey = 'status'

    render() {
        return this.renderPage(
            <EarningsLayout activeKey={Page.activeKey}>
                <RequireCreator />
                <Grid fluid>
                    <Row>
                        <Col xs={10} className="h-full">
                            <h3>{t`Funds`}</h3>
                            <div className="h-full text-center">
                                <div className="justify-center content-center flex h-full">
                                    <p className="text-primary text-6xl">
                                        $ <CountUp delay={1} end={59945} decimals={2}/>
                                    </p>
                                </div>
                                <p className="muted text-2xl" >
                                    {t`01 Jan`} - {t`30 Jan`}
                                </p>
                            </div>
                        </Col>
                        <Col xs={14}>
                            <EarningsDaysPieChart/>
                        </Col>
                    </Row>
                    <Row>
                        <h3>{t`Commissions this month`}</h3>
                        <Col xs={24}>
                            <DayLineChart/>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={24}>
                            <DayTable/>
                        </Col>
                    </Row>
                </Grid>
            </EarningsLayout>
        )
    }
}

export default Page
