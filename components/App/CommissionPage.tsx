import React from 'react';
import { NextPageContext } from 'next'
import { NOT_FOUND } from 'http-status-codes';
import Error from 'next/error'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import {  Commission } from '@db/models'
import { is_server } from '@utility/misc';
import { useCommissionStore } from '@store/commission';
import { initializeStore } from '@app/store'


interface Props extends AuthProps {
    error: number | null
    commissionStoreState: object
}

class CommissionPage extends AuthPage<Props> {

    constructor(props) {
        super(props)
        initializeStore({useCommissionStore}, props.commissionStoreState)
    }

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        const commission_id = ctx.query.commission_id
        let commissionStoreState = {
            commission: null
        }
        let error = null

        if (commission_id) {
            if (is_server()) {
                try {
                    commissionStoreState.commission = await Commission.findById(commission_id).populate("from_user").populate("to_user").lean()
                } catch (err) {
                    null
                }
            }
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

        return super.renderPage(children)
    }
}

export default CommissionPage;