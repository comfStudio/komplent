import { createStore } from '@client/store'
import { is_server } from '@utility/misc'
import { fetch } from '@utility/request'
import log from '@utility/log'
import * as pages from '@utility/pages'
import { AnalyticsType } from '@server/constants'
import { Gallery } from '@db/models'

export const useProfileStore = createStore(
    {
    },
    {
        fetch_data(user_id, type: AnalyticsType) {
            return fetch(pages.profile_stats, {
                method: 'post',
                body: {
                    user_id,
                    type,
                }
            })
        },
        async get_approval_stats(user_id) {
            let r = await this.fetch_data(user_id, AnalyticsType.commission_approval)
            return (await r.json())?.data ?? []
        },
        async get_completion_stats(user_id) {
            let r = await this.fetch_data(user_id, AnalyticsType.commission_completion)
            return (await r.json())?.data ?? []
        },
    }
)

export default useProfileStore

export const useGalleryStore = createStore(
    {
        galleries: []
    },
    {
        async load_items(user) {
            let f = []

            let q = { user }

            let p = "image"

            if (is_server()) {
                f = await Gallery.find(q)
                    .populate(p)
                    .lean()
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Gallery',
                        method: 'find',
                        query: q,
                        populate: p,
                    },
                }).then(async r => {
                    if (r.ok) {
                        f = (await r.json()).data
                    }
                })
            }

            return f
        },
        async delete_gallery(gallery_id) {
            const r = await fetch(pages.gallery, {
                method: 'delete',
                body: {
                    gallery_id
                },
            })

            if (r.ok) {
                this.setState({galleries: this.state.galleries.filter(v => v._id !== gallery_id)})
            }

            return r
        }
    }
)
