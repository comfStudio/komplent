import bodybuilder from 'bodybuilder'

import { createStore } from '@client/store'
import { User } from '@db/models'
import { is_server, promisify_es_search } from '@utility/misc';
import { fetch } from '@utility/request';

export const useSearchStore = createStore(
    {
        results: [],
    },
    {
        parse_search_query(search_query, build=true) {
            let q = bodybuilder()
            q = q.notQuery("match", "type", "consumer")
            q = q.query("match", "settings.visibility", "public")

            if (search_query) {
                if (search_query.q) {
                    q = q.orQuery("multi_match", {
                        query: search_query.q,
                        fields: ["username^10", "name^5", "*"],
                    })
                }
            }

            q = q.from(0).size(30)

            return build ? q.build() : q
        },
        async search_creators(search_query) {
            let r = []
            let q = this.parse_search_query(search_query, false)
            let opt = {
                hydrate: true,
                hydrateOptions: {
                    lean: true,
                    populate: "rates tags settings",
                }
                }
            let d: any

            if (is_server()) {
                d = await promisify_es_search(User, q.build(), opt)
            } else {
                d = await fetch("/api/esearch",{
                    method:"post",
                    body: { model: "User", query: q.build(), options: opt}
                }).then(async r => {
                    if (r.ok) {
                        return (await r.json()).data
                    }
                    return null
                })
            }

            if (d && d.hits && d.hits.hits) {
                r = d.hits.hits
            }

            return r
        }
    }
  );
  
  export default useSearchStore