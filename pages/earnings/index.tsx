import React, { Component, useState } from 'react'

import { Grid, Row, Col } from 'rsuite'
import CountUp from 'react-countup';

import EarningsPage from '@components/App/EarningsPage'
import useEarningsStore, { EarningsKey } from '@store/earnings'
import EarningsLayout from '@components/Earnings/EarningsLayout'
import { RequireCreator } from '@components/Profile'
import { CommissionsDayLineChart, EarningsDaysPieChart, CommissionsDayTable } from '@components/Earnings/Charts'
import { t } from '@app/utility/lang'
import { useMount } from 'react-use';
import { decimal128ToFloat } from '@utility/misc';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const Earnings = () => {

    const store = useEarningsStore()

    const [data, set_data] = useState(0)

    useMount(() => {
        store.get_month_earnings().then(d => set_data(decimal128ToFloat(d.earned)))
    })


    return (
        <div className="h-full text-center">
            <div className="justify-center content-center flex h-full">
                <p className="text-primary text-6xl">
                    $ <CountUp delay={1} end={data} decimals={2}/>
                </p>
            </div>
            <p className="muted text-2xl" >
                {format(startOfMonth(new Date()), 'dd MMM')} - {format(endOfMonth(new Date()), 'dd MMM')}
            </p>
        </div>
    )
}

class Page extends EarningsPage {
    static activeKey: EarningsKey = 'status'

    render() {
        return this.renderPage(
            <EarningsLayout activeKey={Page.activeKey}>
                <RequireCreator />
                <Grid fluid>
                    <Row>
                        <Col xs={10} className="h-full">
                            <h3>{t`Funds earned`}</h3>
                            <Earnings/>
                        </Col>
                        <Col xs={14}>
                            <EarningsDaysPieChart/>
                        </Col>
                    </Row>
                    <Row>
                        <h3>{t`Commissions this month`}</h3>
                        <Col xs={24}>
                            <CommissionsDayLineChart/>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={24}>
                            <CommissionsDayTable/>
                        </Col>
                    </Row>
                </Grid>
            </EarningsLayout>
        )
    }
}

export default Page
