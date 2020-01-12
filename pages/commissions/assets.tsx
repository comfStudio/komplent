import React from 'react'
import { NextPageContext } from 'next'

import CommissionsPage from '@components/App/CommissionsPage'
import CommissionsLayout from '@components/Commissions/CommissionsLayout'
import { RequestListing } from '@components/Commissions/CommissionsListing'
import { RequireCreator } from '@components/Profile'
import { useCommissionsStore } from '@store/commission'

class AssetsPage extends CommissionsPage {

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let commissionsStoreState = useCommissionsStore.createState({
            commissions: [],
        })

        let listtype

        if (props.useUserState.current_user) {
            
            listtype = ctx.query.type ?? (props.useUserState.is_creator ? 'received' : 'sent')

            commissionsStoreState.commissions = await useCommissionsStore.actions.query_commissions(
                "requests",
                props.useUserState.current_user,
                props.useUserState.is_creator,
                ctx.query
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
            <CommissionsLayout activeKey="assets">
            </CommissionsLayout>
        )
    }
}

export default AssetsPage
