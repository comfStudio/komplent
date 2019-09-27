import React from 'react';
import { NextPageContext } from 'next'
import { NOT_FOUND } from 'http-status-codes';
import Error from 'next/error'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import {  Commission } from '@db/models'
import { is_server } from '@utility/misc';
import { useCommissionStore } from '@client/store/commission';
import { fetch } from '@utility/request';

interface Props extends AuthProps {
    error: number | null
    commissionStoreState: object
}

class CommissionPage extends AuthPage<Props> {

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        const commission_id = ctx.query.commission_id
        let commissionStoreState = useCommissionStore.createState({
            commission: null
        })
        let error = null

        if (commission_id) {
            if (is_server()) {
                try {
                    commissionStoreState.commission = await Commission.findById(commission_id)
                        .populate("from_user")
                        .populate("to_user")
                        .populate("stage")
                        .populate("phases")
                        .lean()
                } catch (err) {
                    null
                }
            } else {
                await fetch("/api/fetch", {method:"post", body: {model: "Commission", method:"findById", query: commission_id, populate: ["from_user", "to_user", "stage", "phases"] }}).then(async r => {
                    if (r.ok) {
                        commissionStoreState.commission = (await r.json()).data
                    }
                })
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

        return (
            <useCommissionStore.Provider initialState={this.props.commissionStoreState}>
                {super.renderPage(children)}
            </useCommissionStore.Provider>
        ) 
    }
}

export default CommissionPage;