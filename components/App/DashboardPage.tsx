import React from 'react';

import {AuthPage, Props as AuthProps} from '@components/App/AuthPage'
import { useFollowerStore } from '@store/user';

interface Props extends AuthProps {
    useFollowerStoreState: object
}

class DashboardPage extends AuthPage<Props> {

    static async getInitialProps(ctx) {
        const props = await super.getInitialProps(ctx)

        let useFollowerStoreState = useFollowerStore.createState({
            followers: await useFollowerStore.actions.get_followers(props.useUserState.current_user)
        })

        return {
            ...props,
            useFollowerStoreState
        }
    }

    renderPage(children) {
        return (
            <useFollowerStore.Provider initialState={this.props.useFollowerStoreState}>
                {super.renderPage(children)}
            </useFollowerStore.Provider>
        );
    }
}

export default DashboardPage;