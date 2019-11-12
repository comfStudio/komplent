import React from 'react';

import CommissionPage from '@components/App/CommissionPage'
import CommissionLayout from '@components/Commission/CommissionLayout';
import { NextPageContext } from 'next';
import { useCommissionStore } from '@store/commission';
import log from '@utility/log'
import CommissionConversation from '@components/Commission/CommissionConversation';

class Page extends CommissionPage {

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let commissionStoreState = {
            ...props.commissionStoreState
        }

        if (props.useUserState.logged_in && props.commissionStoreState && props.commissionStoreState.commission) {
            const convo_id = props.commissionStoreState.commission.conversation
            try {
                commissionStoreState.active_conversation = await useCommissionStore.actions.get_conversation(props.commissionStoreState.commission._id)
                if (commissionStoreState.active_conversation) {
                    commissionStoreState.messages = await useCommissionStore.actions.get_messages(commissionStoreState.active_conversation._id)
                }
            } catch (err) {
                log.error(err)
                commissionStoreState.active_conversation = undefined
            }
        }

        return {
            ...props,
            commissionStoreState,
        }
    }

    render() {
        return this.renderPage(
        <CommissionLayout activeKey="inbox">
            <CommissionConversation/>
        </CommissionLayout>
        );
    }
}

export default Page;