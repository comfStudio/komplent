import React from 'react'
import { NextPageContext } from 'next'
import { NOT_FOUND } from 'http-status-codes'
import Error from 'next/error'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import { useCommissionStore } from '@client/store/commission'

interface Props extends AuthProps {
    error: number | null
    commissionStoreState: object
}

class CommissionPage extends AuthPage<Props> {
    static allow_owner = true

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)
        let error = null
        let commissionStoreState

        if (props.useUserState.logged_in) {
            const commission_id = ctx.query.commission_id as string
            commissionStoreState = useCommissionStore.createState({
                commission: null,
                _current_user: props.useUserState.current_user,
            })

            if (commission_id) {
                commissionStoreState.commission = await useCommissionStore.actions.load(
                    commission_id
                )
            }

            if (!commissionStoreState.commission) {
                error = NOT_FOUND
                ctx.res.statusCode = error
            } else {
                let is_owner
                if (typeof props.useUserState.current_user._id === 'string') {
                    is_owner =
                        props.useUserState.current_user._id ===
                        commissionStoreState.commission.from_user._id
                } else {
                    is_owner = commissionStoreState.commission.from_user._id.equals(
                        props.useUserState.current_user._id
                    )
                }
                if (!this.allow_owner && is_owner) {
                    error = NOT_FOUND
                    ctx.res.statusCode = error
                } else {
                    const c = commissionStoreState.commission
                    if (c.commission_process && c.commission_process.length) {
                        commissionStoreState.stages = c.commission_process
                    } else if (c.to_user.commission_process) {
                        commissionStoreState.stages =
                            c.to_user.commission_process
                    }
                }
            }
        }

        return {
            error,
            commissionStoreState,
            ...props,
        }
    }

    renderPage(children) {
        if (this.props.error) {
            return <Error statusCode={this.props.error} />
        }

        return (
            <useCommissionStore.Provider
                initialState={this.props.commissionStoreState}>
                {super.renderPage(children)}
            </useCommissionStore.Provider>
        )
    }
}

export default CommissionPage
