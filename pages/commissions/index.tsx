import React from 'react'

import CommissionsPage, { CommissionsPageProps } from '@components/App/CommissionsPage'
import CommissionsLayout from '@components/Commissions/CommissionsLayout'
import CommissionsListing from '@components/Commissions/CommissionsListing'
import { NextPageContext } from 'next'
import { useCommissionsStore } from '@store/commission'

interface Props extends CommissionsPageProps {
    listtype: 'received' | 'sent'
}

class Page extends CommissionsPage<Props> {

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let commissionsStoreState = useCommissionsStore.createState({
            commissions: [],
        })

        let listtype

        if (props.useUserState.current_user) {
            
            listtype = ctx.query.type ?? (props.useUserState.is_creator ? 'received' : 'sent')

            const btn_state = {
                accepted: props.useUserState.is_creator ? true : false,
                all: false,
                ongoing: ctx.query.ongoing === 'true',
                completed: ctx.query.completed === 'true',
                rejected: ctx.query.rejected === 'true',
                failed: ctx.query.failed === 'true',
                expired: ctx.query.expired === 'true',
            }
            
            if (!Object.values(btn_state).some(Boolean)) {
                btn_state.all = true
            }

            commissionsStoreState.commissions = await useCommissionsStore.actions.search_commissions(
                props.useUserState.current_user,
                listtype,
                ctx.query.search,
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
            <CommissionsLayout activeKey="commissions">
                <CommissionsListing listtype={this.props.listtype} />
            </CommissionsLayout>
        )
    }
}

export default Page
