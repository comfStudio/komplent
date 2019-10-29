import React from 'react';
import { NextPageContext } from 'next'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import useInboxStore, { InboxType, Inbox } from '@store/inbox';
import log from '@utility/log'

interface Props extends AuthProps {
    inboxStoreeState: object
}

class InboxPage extends AuthPage<Props> {

    static activeKey: Inbox

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let inboxStoreeState = useInboxStore.createState({
            activeKey: this.activeKey
        })
        if (props.useUserState.logged_in) {
            inboxStoreeState.conversations = await useInboxStore.actions.search_conversations(props.useUserState.current_user, InboxType.private, ctx.query)
            if (ctx.query.convo_id) {
                try {
                    inboxStoreeState.messages = await useInboxStore.actions.get_messages(ctx.query.convo_id)
                    inboxStoreeState.active_conversation = await useInboxStore.actions.get_conversation(ctx.query.convo_id as string)
                } catch (err) {
                    log.error(err)
                    inboxStoreeState.active_conversation = undefined
                }
            } else {
                inboxStoreeState.active_conversation = undefined
            }
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