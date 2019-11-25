import React from 'react'
import { NextPageContext } from 'next'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import log from '@utility/log'
import useEarningsStore, { EarningsKey } from '@store/earnings'

interface Props extends AuthProps {
    EarningsStoreeState: object
}

class EarningsPage extends AuthPage<Props> {
    static activeKey: EarningsKey

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let EarningsStoreeState = useEarningsStore.createState({
            activeKey: this.activeKey,
        })
        if (props.useUserState.logged_in) {
        }

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
