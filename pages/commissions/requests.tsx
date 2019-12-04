import React from 'react'
import { NextPageContext } from 'next'

import CommissionsPage from '@components/App/CommissionsPage'
import CommissionsLayout from '@components/Commissions/CommissionsLayout'
import { RequestListing } from '@components/Commissions/CommissionsListing'
import { RequireCreator } from '@components/Profile'
import { useCommissionsStore } from '@store/commission'

class RequestsPage extends CommissionsPage {

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let commissionsStoreState = useCommissionsStore.createState({
            commissions: [],
        })

        let listtype

        if (props.useUserState.current_user) {
            
            listtype = ctx.query.type ?? (props.useUserState.is_creator ? 'received' : 'sent')

            const btn_state = {
                accepted: false,
                not_accepted: true,
                all: false,
                ongoing: ctx.query.active === 'true',
                failed: ctx.query.failed === 'true',
                rejected: ctx.query.rejected === 'true',
                expired: ctx.query.expired === 'true',
            }
            
            if (!Object.values(btn_state).some(Boolean)) {
                btn_state.all = true
            }

            commissionsStoreState.commissions = await useCommissionsStore.actions.search_commissions(
                props.useUserState.current_user,
                listtype,
                ctx.query.q,
                btn_state
            )
        }

        return {
            listtype,
            commissionsStoreState,
            ...props,
        }
    }

    render() {
        return this.renderPage(
            <CommissionsLayout activeKey="requests">
                <RequireCreator />
                <RequestListing />
            </CommissionsLayout>
        )
    }
}

export default RequestsPage
