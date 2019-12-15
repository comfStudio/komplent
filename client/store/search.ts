import bodybuilder from 'bodybuilder'
import _ from 'lodash'

import { createStore } from '@client/store'
import { User, Tag } from '@db/models'
import { is_server, promisify_es_search } from '@utility/misc'
import { fetch } from '@utility/request'
import log from '@utility/log'
import { FilterType } from '@components/Search/FiltersPanel'
import { NSFW_LEVEL } from '@server/constants'
import { subDays } from 'date-fns'

let all_tags_identifiers_to_name = {}

export const PRICE_RANGES = {
    1: 50,
    2: 250,
    3: 500,
    4: 1000,
}

export const useSearchStore = createStore(
    {
        items: [],
        count: 0,
        size: 30,
        page: 1,
        categories: [],
        styles: [],
    },
    {
        parse_search_query(search_query, page, size, query: FilterType, build = true) {

            let q = bodybuilder()
            q = q.notQuery('match', 'type', 'consumer')
            q = q.query('match', 'visibility', 'public')

            // prefer creators who just opened commissions
            q = q.orQuery('range', {last_open_status: {gte: subDays(new Date(), 1), boost: 5}, })
            q = q.orQuery('range', {last_open_status: {gte: subDays(new Date(), 3), boost: 4.5}, })
            q = q.orQuery('range', {last_open_status: {gte: subDays(new Date(), 7), boost: 4}, })
            q = q.orQuery('range', {last_open_status: {gte: subDays(new Date(), 14), boost: 3.5}, })
            q = q.orQuery('range', {last_open_status: {gte: subDays(new Date(), 30), boost: 3}, })

            // prefer creators who were last commissioned a long time ago
            q = q.orQuery('range', {last_commissioned: {lte: subDays(new Date(), 30), boost: 4}, })
            q = q.orQuery('range', {last_commissioned: {lte: subDays(new Date(), 14), boost: 3.5}, })
            q = q.orQuery('range', {last_commissioned: {lte: subDays(new Date(), 7), boost: 3}, })
            
            if (query?.comm_status === 'open') {
                q = q.query('match', 'commissions_open', true)
            } else if (query?.comm_status === 'closed') {
                q = q.query('match', 'commissions_open', false)
            }

            if (query?.nsfw_level !== NSFW_LEVEL.level_10) {
                q = q.notQuery('match', 'nsfw', NSFW_LEVEL.level_10)

                if (query?.nsfw_level !== NSFW_LEVEL.level_5) {
                    q = q.notQuery('match', 'nsfw', NSFW_LEVEL.level_5)
                }
            }

            const tags = [...(query?.categories ?? []), ...(query?.styles ?? [])].filter(v => !!all_tags_identifiers_to_name[v]).map(v => all_tags_identifiers_to_name[v])

            if (!_.isEmpty(all_tags_identifiers_to_name) && tags.length) {
                q = q.orQuery('multi_match', {
                    query: tags.join(' '),
                    fields: ['tags.name^2'],
                })
            }

            if (query?.delivery_time === 'short') {
                q = q.orQuery('range', {avg_rate_delivery_time: {gte: 0, lte: 7, boost: 10}, })
                q = q.orQuery('range', {max_rate_delivery_time: {gte: 0, lte: 7, boost: 9}, })
                q = q.orQuery('range', {min_rate_delivery_time: {gte: 0, lte: 7, boost: 8}, })
            } else if (query?.delivery_time === 'medium') {
                q = q.orQuery('range', {avg_rate_delivery_time: {gte: 8, lte: 31, boost: 10}})
                q = q.orQuery('range', {max_rate_delivery_time: {gte: 8, lte: 31, boost: 9}, })
                q = q.orQuery('range', {min_rate_delivery_time: {gte: 8, lte: 31, boost: 8}, })
            } else if (query?.delivery_time === 'long') {
                q = q.orQuery('range', {avg_rate_delivery_time: {gte: 32, boost: 9}})
                q = q.orQuery('range', {max_rate_delivery_time: {gte: 32, boost: 8}, })
                q = q.orQuery('range', {min_rate_delivery_time: {gte: 32, boost: 10}, })
            }

            const price_range = query?.price_range
            const price_ranges = Object.values(PRICE_RANGES)
            price_ranges.sort((a,b) => a-b)
            const min_price_range = price_ranges[0]
            const max_price_range = price_ranges[price_ranges.length-1]

            if (price_range && Object.keys(PRICE_RANGES).includes(price_range.toString())) {
                const gte = PRICE_RANGES[price_range] === min_price_range ? 0 : PRICE_RANGES[price_range] === max_price_range ? PRICE_RANGES[price_range] : price_ranges[parseInt(price_range) - 2]
                const lte = PRICE_RANGES[price_range] === max_price_range ? undefined : PRICE_RANGES[price_range] === min_price_range ? PRICE_RANGES[price_range] : price_ranges[parseInt(price_range)]
                q = q.orQuery('range', {avg_rate_price: {gte, lte, boost: 10}, })
                q = q.orQuery('range', {max_rate_price: {gte, lte, boost: 8}, })
                q = q.orQuery('range', {min_rate_price: {gte, lte, boost: 8}, })
            }
            
            
            if (query?.nsfw_level === NSFW_LEVEL.level_0) {
                q = q.query('match', 'nsfw', NSFW_LEVEL.level_0)
            }

            if (search_query) {
                q = q.orQuery('multi_match', {
                    query: search_query,
                    fields: ['username^12', 'name^5', '*'],
                })
            }

            q = q.from((page - 1) * size).size(size)

            return build ? q.build() : q
        },
        async search_creators(search_query: string, page: number = 1, size: number = 30, query) {

            if (_.isEmpty(all_tags_identifiers_to_name)) {
                if (is_server()) {
                    try {
                        (await Tag.find({})).forEach(v => {
                            all_tags_identifiers_to_name[v.identifier] = v.name
                        })
                    } catch (err) {
                        log.error(err)
                    }
                } else {
                    await fetch('/api/fetch', {
                        method: 'post',
                        body: {
                            model: 'Tag',
                            method: 'find',
                            query: {},
                        },
                    }).then(async r => {
                        if (r.ok) {
                            (await r.json()).data.forEach(v => {
                                all_tags_identifiers_to_name[v.identifier] = v.name
                            })
                        }
                    })
                }
            }

            let count = 0
            let r = []
            let q = this.parse_search_query(search_query, page, size, query, false)
            let opt = {
                hydrate: true,
                hydrateOptions: {
                    lean: true,
                    populate: 'rates tags settings',
                },
            }
            let d: any

            if (is_server()) {
                try {
                    d = await promisify_es_search(User, q.build(), opt)
                } catch (err) {
                    log.error(err)
                }
            } else {
                d = await fetch('/api/esearch', {
                    method: 'post',
                    body: { model: 'User', query: q.build(), options: opt },
                }).then(async r => {
                    if (r.ok) {
                        return (await r.json()).data
                    }
                    return null
                })
            }

            if (d && d.hits && d.hits.hits) {
                r = d.hits.hits
                count = d.hits.total.value
            }

            return {count, items: r.filter(Boolean)}
        },
        async load(){
            let state: any = {}
            
            let cat_q = {categories: [], special: false}
            let style_q = {categories: {$type: 'array', $ne: []}, special: false}

            if (is_server()) {
                try {
                    state.categories = await Tag.find(cat_q)
                    state.styles = await Tag.find(style_q)
                } catch (err) {
                    log.error(err)
                }
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Tag',
                        method: 'find',
                        query: cat_q,
                    },
                }).then(async r => {
                    if (r.ok) {
                        state.categories = (await r.json()).data
                    }
                })

                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Tag',
                        method: 'find',
                        query: style_q,
                    },
                }).then(async r => {
                    if (r.ok) {
                        state.styles = (await r.json()).data
                    }
                })
            }

            return state
        },
        async load_styles(category_identifiers: string[], categories: any[]){
            let category_ids = categories.filter(v => category_identifiers.includes(v.identifier)).map(v => v._id)

            let data = []
            
            let tag_q = {categories: {
                $type: 'array', $ne: [],
                $elemMatch: {$in: category_ids}
            }, special: false}

            if (is_server()) {
                try {
                    data = await Tag.find(tag_q)
                } catch (err) {
                    log.error(err)
                }
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Tag',
                        method: 'find',
                        query: tag_q,
                    },
                }).then(async r => {
                    if (r.ok) {
                        data = (await r.json()).data
                    }
                })
            }

            return data
        },
    }
)

export default useSearchStore
