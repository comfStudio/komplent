import React from 'react'
import { NextPageContext } from 'next'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import useInboxStore, { InboxType, InboxKey } from '@store/inbox'
import log from '@utility/log'

interface Props extends AuthProps {
    inboxStoreeState: object
}

class InboxPage extends AuthPage<Props> {
    static activeKey: InboxKey

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let inboxStoreeState = useInboxStore.createState({
            activeKey: this.activeKey,
        })
        if (props.useUserState.logged_in) {
            let type = (ctx.query.type as string)
            let convo_id = ctx.query.convo_id

            const get_convo = async (c_id) => {
                if (c_id) {
                    try {
                        inboxStoreeState.messages = await useInboxStore.actions.get_messages(
                            c_id
                        )
                        inboxStoreeState.active_conversation = await useInboxStore.actions.get_conversation(
                            c_id as string
                        )
                    } catch (err) {
                        log.error(err)
                        inboxStoreeState.active_conversation = undefined
                    }
                } else {
                    inboxStoreeState.active_conversation = undefined
                }
            }

            if (!type) {
                if (inboxStoreeState.active_conversation) {
                    type = inboxStoreeState.active_conversation.type
                } else {
                    if (convo_id) {
                        await get_convo(convo_id)
                    }
                    if (inboxStoreeState.active_conversation) {
                        type = inboxStoreeState.active_conversation.type
                    } else {
                        type = "commission"
                    }
                }
            }

            // eslint-disable-next-line
            inboxStoreeState.conversations = await useInboxStore.actions.search_conversations(
                props.useUserState.current_user,
                type as any,
                ctx.query.inbox_q,
                {
                    trashed: this.activeKey === 'trash',
                }
            )

            if (!inboxStoreeState.active_conversation) {
                convo_id = inboxStoreeState?.conversations?.[0]?._id
                if (convo_id) {
                    await get_convo(convo_id)
                }
            }
        }

        return {
            ...props,
            inboxStoreeState,
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

export default InboxPage
