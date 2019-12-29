import { createStore } from ".";
import { is_server } from "@utility/misc";
import { Follow } from "@db/models";
import { fetch } from '@utility/request'
import { get_top_commissioners } from '@services/aggregates'

export const useFollowStore = createStore(
    {
        items: [],
        top_commissioners: [],
        count: 0,
        size: 30,
        page: 1,
    },{
        async load_items(type: 'followee' | 'follower', user, page, size) {
            let f = []

            const p_key = type === 'followee' ? 'follower' : 'followee'
            let q = { end: null }
            q[type] = user._id

            let p = {
                path: p_key,
                populate: [
                    {
                        path: 'rates',
                        model: 'CommissionRate',
                    },
                    {
                        path: 'tags',
                        model: 'Tag',
                    },
                    {
                        path: 'avatar',
                    },
                ]
            }

            if (is_server()) {
                f = await Follow.find(q)
                    .populate(p)
                    .sort({ created: -1 })
                    .skip((page - 1) * size)
                    .limit(size)
                    .lean()
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Follow',
                        method: 'find',
                        query: q,
                        sort: { created: -1 },
                        skip: (page - 1) * size,
                        limit: size,
                        populate: p,
                    },
                }).then(async r => {
                    if (r.ok) {
                        f = (await r.json()).data
                    }
                })
            }
            f = f.map(v => v[p_key])

            return f
        },
        async load_top_commissioners(user, size) {
            let f = []

            const p_key = 'follower'
            let q = { end: null, followee: user._id }

            let p = {
                path: p_key,
                populate: [
                    {
                        path: 'avatar',
                    },
                ]
            }

            if (is_server()) {
                f = await Follow.find(q)
                    .populate(p)
                    .sort({ created: -1 })
                    .limit(size)
                    .lean()
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Follow',
                        method: 'find',
                        query: q,
                        sort: { created: -1 },
                        limit: size,
                        populate: p,
                    },
                }).then(async r => {
                    if (r.ok) {
                        f = (await r.json()).data
                    }
                })
            }
            f = f.map(v => v[p_key])

            return f
        }
    })