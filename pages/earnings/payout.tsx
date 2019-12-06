import React, { Component } from 'react'

import { Grid, Row, Col } from 'rsuite'

import EarningsPage, { EarningsProps } from '@components/App/EarningsPage'
import { EarningsKey, usePayoutStore } from '@store/earnings'
import EarningsLayout from '@components/Earnings/EarningsLayout'
import { RequireCreator } from '@components/Profile'
import { t } from '@app/utility/lang'
import { PayoutHistoryTable } from '@components/Earnings/Charts'
import { PayoutBalance } from '@components/Earnings/Payout'
import { NextPageContext } from 'next'
import { get_payout_balance } from '@services/analytics'

interface Props extends EarningsProps {
    PayoutStoreState: object
}

class PayoutPage extends EarningsPage<Props> {
    static activeKey: EarningsKey = 'payout'

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let PayoutStoreState = usePayoutStore.createState({})

        if (props.useUserState.logged_in) {
            PayoutStoreState = {
                ...PayoutStoreState,
                ...await usePayoutStore.actions.load(props.useUserState.current_user),
                pending_payout: await usePayoutStore.actions.load_pending_payout(props.useUserState.current_user)
            }
        }

        return {
            ...props,
            PayoutStoreState,
        }
    }

    render() {
        return this.renderPage(
            <usePayoutStore.Provider initialState={this.props.PayoutStoreState}>
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
            </usePayoutStore.Provider>
        )
    }
}

export default PayoutPage
