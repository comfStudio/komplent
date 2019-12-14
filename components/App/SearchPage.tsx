import React from 'react'
import { NextPageContext } from 'next'
import qs from 'qs'

import { OptionalAuthPage, Props as AuthProps } from '@components/App/AuthPage'
import useSearchStore from '@store/search'
import { NSFW_LEVEL } from '@server/constants'

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
            size,
            ...await useSearchStore.actions.load()
        })

        const parsed_query = qs.parse(ctx.query)
        parsed_query.categories = parsed_query?.categories ?? searchStoreState.categories.map(v => v.identifier)
        parsed_query.styles = parsed_query?.styles ?? (await useSearchStore.actions.load_styles(parsed_query.categories, searchStoreState.categories)).map(v => v.identifier)
        parsed_query.nsfw_level = parsed_query?.nsfw_level ?? NSFW_LEVEL.level_0
        if (props.useUserState.logged_in && props.useUserState.current_user.show_nsfw != NSFW_LEVEL.level_0) {
            parsed_query.nsfw_level = props.useUserState.current_user.show_nsfw
        }

        searchStoreState = {...searchStoreState,
            ...await useSearchStore.actions.search_creators(ctx.query.q as string, page, size, parsed_query),
            
        }

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
