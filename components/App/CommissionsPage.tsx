import React from 'react';
import { NextPageContext } from 'next'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import { useCommissionsStore } from '@client/store/commission';
import { is_server } from '@utility/misc';
import {  Commission } from '@db/models'
import { fetch } from '@utility/request';


interface Props extends AuthProps {
    commissionsStoreState: object
}

class CommissionsPage extends AuthPage<Props> {

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let commissionsStoreState = useCommissionsStore.createState({
            commissions: []
        })

        if (props.useUserState.current_user) {
            if (is_server()) {
                commissionsStoreState.commissions = await Commission.find_related(props.useUserState.current_user._id)
            } else {
                await fetch("/api/fetch", {method:"post", body: {model: "Commission", method:"find_related", query: props.useUserState.current_user._id}}).then(async r => {
                    if (r.ok) {
                        commissionsStoreState.commissions = (await r.json()).data
                    }
                })
            }
        }

        return {
            commissionsStoreState,
            ...props
        }
    }

    renderPage(children) {
        return (
            <useCommissionsStore.Provider initialState={this.props.commissionsStoreState}>
                {super.renderPage(children)}
            </useCommissionsStore.Provider>
        )
    }

}

export default CommissionsPage;