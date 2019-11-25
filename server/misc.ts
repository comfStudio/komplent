import { is_server } from '@utility/misc'
import { Text } from '@db/models'
import { fetch } from '@utility/request'

export const fetch_database_text = async (id: string) => {
    if (id) {
        const q = id
        if (is_server()) {
            return await Text.findById(q)
        } else {
            return await fetch('/api/fetch', {
                method: 'post',
                body: { model: 'Text', method: 'findById', query: q },
            }).then(async r => {
                if (r.ok) {
                    return (await r.json()).data
                }
                return null
            })
        }
    }
}
