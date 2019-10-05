import React from 'react';
import { NextPageContext } from 'next'

import { OptionalAuthPage, Props as AuthProps } from '@components/App/AuthPage'
import useSearchStore from '@store/search';

interface Props extends AuthProps {
    searchStoreeState: object
}

class SearchPage extends OptionalAuthPage<Props> {

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let searchStoreeState = useSearchStore.createState({})
        searchStoreeState.results = await useSearchStore.actions.search_creators(ctx.query)

        return {
            ...props,
            searchStoreeState
        }
    }

    renderPage(children) {
        return (
            <useSearchStore.Provider initialState={this.props.searchStoreeState}>
                {super.renderPage(children)}
            </useSearchStore.Provider>
        )
    }
}

export default SearchPage;