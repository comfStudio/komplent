import bodybuilder from 'bodybuilder'

import { createStore } from '@client/store'
import { User } from '@db/models'
import { is_server, promisify_es_search } from '@utility/misc'
import { fetch } from '@utility/request'
import log from '@utility/log'

export const useSearchStore = createStore(
    {
        items: [],
        count: 0,
        size: 30,
        page: 1,
    },
    {
        parse_search_query(search_query, page, size, build = true) {
            let q = bodybuilder()
            q = q.notQuery('match', 'type', 'consumer')
            q = q.query('match', 'visibility', 'public')

            if (search_query) {
                q = q.orQuery('multi_match', {
                    query: search_query,
                    fields: ['username^10', 'name^5', '*'],
                })
            }

            q = q.from((page - 1) * size).size(size)

            return build ? q.build() : q
        },
        async search_creators(search_query: string, page: number = 1, size: number = 30) {
            let count = 0
            let r = []
            let q = this.parse_search_query(search_query, page, size, false)
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
    }
)

export default useSearchStore
