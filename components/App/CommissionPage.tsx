import React from 'react';
import { NextPageContext } from 'next'
import { NOT_FOUND } from 'http-status-codes';
import Error from 'next/error'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import { useCommissionStore } from '@client/store/commission';

interface Props extends AuthProps {
    error: number | null
    commissionStoreState: object
}

class CommissionPage extends AuthPage<Props> {

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        const commission_id = ctx.query.commission_id as string
        let commissionStoreState = useCommissionStore.createState({
            commission: null,
            _current_user: props.useUserState.current_user,
        })
        let error = null

        if (commission_id) {
            commissionStoreState.commission = await useCommissionStore.actions.load(commission_id)
        }

        if (!commissionStoreState.commission) {
            error = NOT_FOUND
            ctx.res.statusCode = error
        }
        
        return {
            error,
            commissionStoreState,
            ...props
        }
    }

    renderPage(children) {

        if (this.props.error) {
            return <Error statusCode={this.props.error}/>
        }

        return (
            <useCommissionStore.Provider initialState={this.props.commissionStoreState}>
                {super.renderPage(children)}
            </useCommissionStore.Provider>
        ) 
    }
}

export default CommissionPage;