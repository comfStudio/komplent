import React from 'react'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import { useFollowerStore, useNotificationStore } from '@store/user'

interface Props extends AuthProps {
    useFollowerStoreState: object
    useNotificationStoreState: object
}

class DashboardPage extends AuthPage<Props> {
    static async getInitialProps(ctx) {
        const props = await super.getInitialProps(ctx)

        let useFollowerStoreState = useFollowerStore.createState({
            followers: await useFollowerStore.actions.get_followers(
                props.useUserState.current_user
            ),
        })

        let useNotificationStoreState = useNotificationStore.createState({
            notifications: await useNotificationStore.actions.get_notifications(
                props.useUserState.current_user
            ),
        })

        return {
            ...props,
            useFollowerStoreState,
            useNotificationStoreState,
        }
    }

    renderPage(children) {
        return (
            <useFollowerStore.Provider
                initialState={this.props.useFollowerStoreState}>
                <useNotificationStore.Provider
                    initialState={this.props.useNotificationStoreState}>
                    {super.renderPage(children)}
                </useNotificationStore.Provider>
            </useFollowerStore.Provider>
        )
    }
}

export default DashboardPage
