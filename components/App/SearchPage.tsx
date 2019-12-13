import React from 'react'
import { NextPageContext } from 'next'

import { OptionalAuthPage, Props as AuthProps } from '@components/App/AuthPage'
import useSearchStore from '@store/search'

interface Props extends AuthProps {
    searchStoreState: object
}

class SearchPage extends OptionalAuthPage<Props> {
    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        const page = parseInt((ctx.query.page as string) ?? '1')
        const size = parseInt((ctx.query.size as string) ?? '30')

        let searchStoreState = useSearchStore.createState({
            page,
            size
        })

        searchStoreState = {...searchStoreState,
            ...await useSearchStore.actions.search_creators(ctx.query.q as string, page, size, ctx.query)}

        return {
            ...props,
            searchStoreState,
        }
    }

    renderPage(children) {
        return (
            <useSearchStore.Provider
                initialState={this.props.searchStoreState}>
                {super.renderPage(children)}
            </useSearchStore.Provider>
        )
    }
}

export default SearchPage
