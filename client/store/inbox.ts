import bodybuilder from 'bodybuilder'

import { createStore } from '@client/store'
import { User, Conversation, Message } from '@db/models'
import { is_server, promisify_es_search } from '@utility/misc'
import { fetch } from '@utility/request'
import { update_db } from '@client/db'
import { conversation_schema, message_schema } from '@schema/message'
import log from '@utility/log'

export type InboxKey = 'inbox' | 'trash'

export enum InboxType {
    private,
    staff,
    commission,
}

export const useInboxStore = createStore(
    {
        activeKey: undefined as InboxKey,
        page: 0,
        conversations: [],
        active_conversation: undefined as any,
        messages: [],
    },
    {
        async new_conversation(
            user: any,
            subject: string,
            {
                to = undefined as string,
                commission = undefined as any,
                users = [],
                params = undefined,
            } = {}
        ) {
            let d = {
                subject,
                users: [user._id],
                commission,
            }

            if (users) {
                d.users = [...d.users, ...users]
            }

            if (to) {
                let q = { username: to }
                let u
                if (is_server()) {
                    u = await User.findOne(q).lean()
                } else {
                    await fetch('/api/fetch', {
                        method: 'post',
                        body: { model: 'User', method: 'findOne', query: q },
                    }).then(async r => {
                        if (r.ok) {
                            u = (await r.json()).data
                        }
                    })
                }
                if (u) {
                    d.users.push(u._id)
                } else {
                    throw Error(`User ${to} not found`)
                }
            }

            let r = await update_db({
                model: 'Conversation',
                data: d,
                schema: conversation_schema,
                create: true,
                validate: true,
                populate: 'users',
                ...params,
            })
            if (r.status) {
                // this.setState({
                //     conversations: [r.body.data, ...this.state.conversations],
                //     messages: [],
                //     active_conversation: r.body.data,
                // })
            }
            return r
        },
        parse_search_query(
            user,
            type: InboxType,
            search_query,
            page = 0,
            build = true,
            { active = false, trashed = false } = {}
        ) {

            const limit = 30

            let q = bodybuilder()
            q = q.query('match', 'users', user._id.toString())
            q = q.sort("last_message", "desc")
            // if (active) {
            //     q = q.query('match', 'active', true)
            // }
            if (trashed) {
                q = q.query('match', 'trashed', true)
            }
            if (type) {
                q = q.query('match', 'type', type.toString())
            }
            // q = q.notQuery("match", "type", "consumer")

            if (search_query) {
                q = q.query('multi_match', {
                    query: search_query,
                    fields: ['subject^10'],
                })
            }

            q = q.from(page * limit).size(limit)

            return build ? q.build() : q
        },
        async search_conversations(
            user,
            type: InboxType,
            search_query,
            { active = false, trashed = false, page = 0 } = {}
        ) {
            let r = []
            let q = this.parse_search_query(user, type, search_query, page, false, {
                trashed,
            })

            let opt = {
                hydrate: true,
                hydrateOptions: {
                    lean: true,
                    populate: [
                        { path: "commission"},
                        {
                        path: 'users',
                        populate: [
                            {
                                path: 'avatar',
                            },
                        ]
                    },
                ]
                },
            }
            let d: any

            if (is_server()) {
                try {
                    d = await promisify_es_search(Conversation, q.build(), opt)
                } catch (err) {
                    log.error(err)
                }
            } else {
                d = await fetch('/api/esearch', {
                    method: 'post',
                    body: {
                        model: 'Conversation',
                        query: q.build(),
                        options: opt,
                    },
                }).then(async r => {
                    if (r.ok) {
                        return (await r.json()).data
                    }
                    return null
                })
            }

            if (d && d.hits && d.hits.hits) {
                r = d.hits.hits.filter(Boolean)
            }

            return r
        },
        async get_conversation(conversation_id) {
            let u
            if (is_server()) {
                u = await Conversation.findById(conversation_id).lean()
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Conversation',
                        method: 'findById',
                        query: conversation_id,
                    },
                }).then(async r => {
                    if (r.ok) {
                        u = (await r.json()).data
                    }
                })
            }
            return u
        },
        async get_conversation_unread_count(current_user_id, type = undefined) {
            let q: any = { users: current_user_id,  last_message_seen_by: { "$ne": current_user_id } }
            if (type) {
                q = {...q, type}
            }
            let u
            if (is_server()) {
                u = await Message.find(q).countDocuments()
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Conversation',
                        query: q,
                        count: true,
                    },
                }).then(async r => {
                    if (r.ok) {
                        u = (await r.json()).data
                    }
                })
            }
            return u
        },
        async get_conversation_read_status(conversation_id, current_user_id) {
            let q = { _id: conversation_id, last_message_seen_by: { "$ne": current_user_id } }
            let u
            if (is_server()) {
                throw Error("not implemented")
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Conversation',
                        query: q,
                        count: true,
                    },
                }).then(async r => {
                    if (r.ok) {
                        u = (await r.json()).data
                    }
                })
            }
            return u
        },
        async get_messages(conversation_id, {page = 0, limit = 15} = {}) {
            let mdata = []
            let q = { conversation: conversation_id }
            let s = { created: -1 }
            let skip = limit * page
            let p = [
                {
                    path: 'user',
                    populate: [
                        {
                            path: 'avatar',
                        },
                    ]
                },
            ]
            if (is_server()) {
                mdata = await Message.find(q)
                    .populate(p)
                    .sort(s)
                    .skip(skip)
                    .limit(limit)
                    .lean()
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Message',
                        query: q,
                        populate: p,
                        sort: s,
                        skip,
                        limit,
                    },
                }).then(async r => {
                    if (r.ok) {
                        mdata = (await r.json()).data
                    }
                })
            }
            return mdata
        },
        async new_message(
            user: any,
            conversation: any,
            body: string,
            { params = undefined } = {}
        ) {
            let d = {
                body,
                users_read: [user._id],
                user: user,
                conversation,
            }

            let r = await update_db({
                model: 'Message',
                data: d,
                schema: message_schema,
                create: true,
                validate: true,
                populate: {
                    path: 'user',
                    populate: [
                        {
                            path: 'avatar',
                        },
                    ]
                },
                ...params,
            })
            if (r.status) {
                this.setState({
                    message: [r.body.data, ...this.state.messages],
                })
                update_db({
                    model: 'Conversation',
                    data: { _id: this.state.active_conversation, last_message_seen_by: [...d.users_read] },
                    schema: conversation_schema,
                    create: false,
                    validate: true
                })
            }

            return r
        },
        async mark_message_read(user: any, message: any, { params = undefined } = {}) {
            let users_read = message.users_read
            if (!users_read.includes(user._id)) {
                let d = {
                    _id: message._id,
                    users_read: [user._id, ...users_read],
                }

                if (this.state.active_conversation.last_message <= message.created) {
                    update_db({
                        model: 'Conversation',
                        data: { _id: this.state.active_conversation, last_message_seen_by: [...d.users_read] },
                        schema: conversation_schema,
                        create: false,
                        validate: true
                    })
                }
    
                let r = await update_db({
                    model: 'Message',
                    data: d,
                    schema: message_schema,
                    create: false,
                    validate: true,
                    ...params,
                })
                if (r.status) {

                    return r.body.data
                }
    
                return r
            }
            return null
        },
    }
)

export default useInboxStore
