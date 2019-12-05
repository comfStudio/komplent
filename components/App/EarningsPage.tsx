import React from 'react'
import { NextPageContext } from 'next'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import log from '@utility/log'
import useEarningsStore, { EarningsKey } from '@store/earnings'

export interface EarningsProps extends AuthProps {
    EarningsStoreeState: object
}

class EarningsPage<T extends EarningsProps = EarningsProps> extends AuthPage<T> {
    static activeKey: EarningsKey

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let EarningsStoreeState = useEarningsStore.createState({
            activeKey: this.activeKey,
        })

        return {
            ...props,
            EarningsStoreeState,
        }
    }

    renderPage(children) {
        return (
            <useEarningsStore.Provider
                initialState={this.props.EarningsStoreeState}>
                {super.renderPage(children)}
            </useEarningsStore.Provider>
        )
    }
}

export default EarningsPage
