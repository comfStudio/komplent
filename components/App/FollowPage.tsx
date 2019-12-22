import React from 'react'
import { NextPageContext } from 'next'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import log from '@utility/log'
import { useFollowStore } from '@store/follow'

export type TypeKey = "followee" | "follower"

interface Props extends AuthProps {
    followStoreState: object
}

class FollowPage extends AuthPage<Props> {
    static type: TypeKey

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let followStoreState = useFollowStore.createState({
        })
        if (props.useUserState.logged_in) {

            const page = parseInt((ctx.query.page as string) ?? '1')
            const size = parseInt((ctx.query.size as string) ?? '30')

            followStoreState.items = await useFollowStore.actions.load_items(this.type, props.useUserState.current_user, page, size)

        }

        return {
            ...props,
            followStoreState,
        }
    }

    renderPage(children) {
        return (
            <useFollowStore.Provider initialState={this.props.followStoreState}>
                {super.renderPage(children)}
            </useFollowStore.Provider>
        )
    }
}

export default FollowPage
