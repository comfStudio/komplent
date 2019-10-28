import React from 'react';
import { NextPageContext } from 'next'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import useInboxStore from '@store/inbox';
import log from '@utility/log'

interface Props extends AuthProps {
    inboxStoreeState: object
}

class InboxPage extends AuthPage<Props> {

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let inboxStoreeState = useInboxStore.createState({})
        inboxStoreeState.conversations = await useInboxStore.actions.search_conversations(ctx.query)
        if (ctx.query.conv_id) {
            try {
                inboxStoreeState.messages = await useInboxStore.actions.get_messages(ctx.query.conv_id)
                inboxStoreeState.active_conversation = ctx.query.conv_id as string
            } catch (err) {
                log.error(err)
                inboxStoreeState.active_conversation = ""
            }
        } else {
            inboxStoreeState.active_conversation = ""
        }

        return {
            ...props,
            inboxStoreeState
        }
    }

    renderPage(children) {
        return (
            <useInboxStore.Provider initialState={this.props.inboxStoreeState}>
                {super.renderPage(children)}
            </useInboxStore.Provider>
        )
    }
}

export default InboxPage;