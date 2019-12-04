import React from 'react'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import { useCommissionsStore } from '@client/store/commission'

export interface CommissionsPageProps extends AuthProps {
    commissionsStoreState?: object
}

class CommissionsPage<T extends CommissionsPageProps = CommissionsPageProps> extends AuthPage<T> {

    renderPage(children) {
        return (
            <useCommissionsStore.Provider
                initialState={this.props.commissionsStoreState}>
                {super.renderPage(children)}
            </useCommissionsStore.Provider>
        )
    }
}

export default CommissionsPage
