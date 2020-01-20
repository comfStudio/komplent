import bodybuilder from 'bodybuilder'

import { createStore, bootstrapStoreDev } from '@client/store'
import { update_db } from '@app/client/db'
import {
    comission_rate_schema,
    commission_extra_option_schema,
    commission_schema,
} from '@schema/commission'
import { iupdate, is_server, promisify_es_search } from '@utility/misc'
import {
    CommissionExtraOption,
    CommissionRate,
    Commission,
    Conversation,
    License,
} from '@db/models'
import { fetch } from '@utility/request'
import {
    post_task,
    TaskMethods,
    post_task_d_15_secs,
    post_task_d_1_secs,
} from '@client/task'
import {
    TASK,
    CommissionPhaseType,
    CommissionPhaseT,
    commission_phases,
} from '@server/constants'
import { CommissionProcessType } from '@schema/user'
import useInboxStore from './inbox'
import { payment_schema } from '@schema/monetary'
import log from '@utility/log'
import { OK } from 'http-status-codes'
import { license_schema } from '@schema/general'
import { conversation_schema } from '@schema/message'
import useUserStore from './user'

export const useCommissionStore = createStore(
    {
        _current_user: {} as any,
        commission: undefined,
        stages: [] as CommissionProcessType[],
        active_conversation: undefined as any,
        commission_count: undefined,
        messages: [],
        products: []
    },
    {
        get_messages: useInboxStore.actions.get_messages,
        new_message: useInboxStore.actions.new_message,
        async start_conversation() {
            this.setState({
                active_conversation: await update_db({
                    model: 'Conversation',
                    data: {
                        type: 'commission',
                        subject: this.state.commission.from_title,
                        users: [this.state.commission.from_user, this.state.commission.to_user],
                        commission: this.state.commission._id,
                    },
                    schema: conversation_schema,
                    create: true,
                    validate: true,
                }).then(r => {
                    if (r.status) {
                        return r.body.data
                    }
                    return undefined
                })
            })
        },
        async get_conversation(commission_id) {
            let u
            let q = {
                commission: commission_id,
            }
            if (is_server()) {
                u = await Conversation.find(q).lean()
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: { model: 'Conversation', method: 'find', query: q },
                }).then(async r => {
                    if (r.ok) {
                        u = (await r.json()).data
                    }
                })
            }

            return u && u.length ? u[0] : null
        },
        get_commission() {
            let c
            if (this.state.commission) {
                c = {
                    ...this.state.commission,
                    rate: {
                        ...this.state.commission.rate,
                        price: {
                            $numberDecimal: this.state.commission.rate.price,
                        },
                    },
                    extras: this.state.commission.extras
                        ? this.state.commission.extras.map(v => ({
                              ...v,
                              price: { $numberDecimal: v.price },
                          }))
                        : this.state.commission.extras,
                }
            }
            return c || {}
        },
        async create_commission(data, ...params) {
            let d = { ...data }

            if (typeof d.rate === 'string') {
                d.rate = await useCommissionRateStore.actions.get_rate(d.rate)
            }

            if (!d.rate) {
                throw Error('A valid commission rate is required')
            }

            if (typeof d.rate === 'object') {
                if (d.rate.price && typeof d.rate.price === 'object') {
                    d.rate.price = d.rate.price['$numberDecimal']
                }

                if (d.rate.extras) {
                    d.rate.extras = d.rate.extras.map(v => ({
                        ...v,
                        price: v.price['$numberDecimal'],
                    }))
                }
            }

            if (typeof d.suggested_price !== 'number' && !d.suggested_price) {
                d.suggested_price = null
            }

            if (d.extras && typeof d.extras[0] === 'string') {
                d.extras = await useCommissionRateStore.actions.get_extraoptions(
                    d.extras
                )
            }

            if (d.extras) {
                d.extras = d.extras.map(v => ({
                    ...v,
                    price: v.price['$numberDecimal'],
                }))
            }

            let r = await update_db({
                model: 'Commission',
                data: d,
                schema: commission_schema,
                create: true,
                validate: true,
                ...params,
            })
            if (r.status) {
                this.setState({ commission: r.body.data })
            }
            return r
        },

        async update(data: any, ...params) {
            data._id = this.state.commission._id
            const r = await update_db({
                model: 'Commission',
                data: data,
                schema: commission_schema,
                validate: true,
                ...params,
            })
            if (r.status) {
                await this.refresh()
            }
            return r
        },

        async refresh() {
            let rc = await this.load(this.state.commission._id)
            if (rc) {
                this.setState({ commission: rc, stages: rc.commission_process })
            }
            return rc
        },

        async accept_suggested_price() {
            let r = await fetch('/api/commission/suggest_price', {
                method: 'post',
                body: { commission_id: this.state.commission._id, accept: true },
            })

            if (r.status === OK) {
                r = await this.next_phase()
                r = await this.refresh()
            }
            return r
        },

        async suggest_price(new_price: number) {
            let r = await fetch('/api/commission/suggest_price', {
                method: 'post',
                body: { commission_id: this.state.commission._id, accept: false, new_price },
            })
            if (r.status === OK) {
                r = await this.refresh()
            }
            return r
        },

        async complete_phase(done = true) {
            let r = await update_db({
                model: 'CommissionPhase',
                data: {
                    _id: this.state.commission.stage._id,
                    done,
                    done_date: done ? new Date() : null,
                },
                schema: commission_schema,
                validate: true,
            })
            this.refresh()
            return r
        },

        async complete_default_stage(
            on_stage: CommissionPhaseType | CommissionProcessType = undefined
        ) {
            if (typeof on_stage === 'object') {
                on_stage = on_stage.type
            }
            let d_stages = []
            let set = false
            this.state.stages.forEach(v => {
                if (!v.done && !set && (!on_stage || on_stage === v.type)) {
                    set = true
                    v.done = true
                    d_stages.push({ ...v })
                } else {
                    d_stages.push({ ...v })
                }
            })
            this.setState({ stages: d_stages })
            return await this.update({ commission_process: d_stages })
        },

        async add_phase(
            type: CommissionPhaseType | CommissionProcessType,
            {
                complete_previous_phase = true,
                refresh = false,
                done = false,
                params = {},
                data = undefined,
            } = {}
        ) {
            if (complete_previous_phase) {
                await this.complete_phase()
            }

            await this.complete_default_stage()

            if (typeof type === 'object') {
                type = type.type
            }

            let r = await update_db({
                model: 'CommissionPhase',
                data: {
                    type,
                    commission: this.state.commission._id,
                    done,
                    done_date: done ? new Date() : undefined,
                    data: data,
                    user: this.state._current_user._id,
                },
                schema: commission_schema,
                validate: true,
                create: true,
                ...params,
            })
            if (r.status) {
                post_task_d_1_secs(TaskMethods.schedule_now, {
                    task: TASK.commission_phase_updated,
                    data: {
                        user_id: this.state._current_user._id,
                        from_user_id: this.state.commission.from_user._id,
                        to_user_id: this.state.commission.to_user._id,
                        commission_id: this.state.commission._id,
                        phase: r.body.data,
                    },
                })
            }
            if (refresh && r.status) {
                this.refresh()
            }
            return r
        },

        async pay(phase_data: any) {
            let r = await fetch('/api/commission/pay', {
                method: 'post',
                body: { commission_id: this.state.commission._id, payment_phase_id: phase_data._id },
            })

            if (r.status === OK) {
                r = await this.next_phase()
                this.refresh()
            }
            return r
        },

        async unlock() {
            let r = await this.add_phase('unlock', {
                done: true,
                refresh: false,
            })
            r = await this.add_phase('complete', {
                complete_previous_phase: false,
            })
            if (r.status) {
                this.refresh()
            }
            return r
        },

        async add_payment_phase(last = false) {
            let count = 0
            for (let p of this.state.commission.phases.filter(
                v => v.type === 'pending_payment'
            )) {
                count += 1
            }
            let r = await this.add_phase('pending_payment', {
                data: { count: count + 1, last: last },
            })
            return r
        },

        async accept() {
            let r = await this.update({
                accepted: true,
            })
            if (r.status) {
                r = await this.next_phase()
                this.refresh()
            }
            return r
        },

        async exhaust_revisions() {
            let d_stages: CommissionProcessType[] = this.get_next_stages()
            if (d_stages.length) {
                let n = d_stages.shift()
                while (n.type === 'revision') {
                    n = null
                    this.complete_default_stage()
                    if (d_stages) {
                        n = d_stages.shift()
                    }
                }
            }
        },

        async confirm_products() {
            await this.exhaust_revisions()
            let r = await this.next_phase()
            this.refresh()
            return r
        },

        async delete_product(_id) {
            let r = await fetch('/api/asset', {
                method: 'delete',
                body: { commission_id: this.state.commission._id, asset_ids: [_id] },
            })

            if (r.ok) {
                this.setState({products: this.state.products.filter(v => v._id != _id)})
            }

            return r
        },

        async delete_attachment(_id) {
            let r = await fetch('/api/asset', {
                method: 'delete',
                body: { commission_id: this.state.commission._id, asset_ids: [_id], key: "attachments" },
            })

            if (r.ok) {
                this.update({attachments: this.state.commission.attachments.filter(v => v._id != _id)})
            }

            return r
        },

        async delete_draft(_id) {
            let r = await fetch('/api/asset', {
                method: 'delete',
                body: { commission_id: this.state.commission._id, asset_ids: [_id], key: "drafts" },
            })

            if (r.ok) {
                this.update({drafts: this.state.commission.drafts.filter(v => v._id != _id)})
            }

            return r
        },

        async confirm_drafts() {
            await this.exhaust_revisions()
            let r = await this.next_phase()
            this.refresh()
            return r
        },

        async add_revision_phase(visible = true) {
            let r = await this.add_phase('revision', {
                data: { confirmed: [], visible },
            })
            return r
        },

        get_stage_count(stage_type: CommissionPhaseType, next = true) {
            let count = 0
            let stages = []
            if (next) {
                stages = this.get_next_stages()
            }
            let idx = 0
            while (stages.length < idx && stages[idx]) {
                if (stages[idx] === stage_type) {
                    count++
                }
                idx++
            }
            return count
        },

        async confirm_revision(new_revision = false) {
            const user_id = this.state._current_user._id
            const stage = this.state.commission.stage
            if (stage.type !== 'revision') {
                throw Error('Revision can only be done in the revision phase')
            }
            let stage_data = {
                confirmed: [],
            }
            if (stage.data) {
                stage_data = { ...stage.data }
            }

            stage_data.confirmed = [user_id, ...stage_data.confirmed].reduce(
                (unique, item) =>
                    unique.includes(item) ? unique : [...unique, item],
                []
            )

            let r = await update_db({
                model: 'CommissionPhase',
                data: { _id: stage._id, data: stage_data },
                schema: commission_schema,
                validate: true,
            })
            if (r.status) {
                let participants = [
                    this.state.commission.from_user._id,
                    this.state.commission.to_user._id,
                ]
                if (participants.every(v => stage_data.confirmed.includes(v))) {
                    if (new_revision) {
                        r = this.add_revision_phase()
                    } else {
                        r = this.next_phase()
                    }
                }
                this.refresh()
            }
            return r
        },

        async cancel() {
            if (!this.state.commission.payments.length) {
                let r = await this.add_phase('cancel', {
                    done: true,
                    complete_previous_phase: false,
                })
                if (r.status) {
                    r = await this.end()
                }
                return r
            } else {
                throw Error("Cannot cancel a request that has had a transaction")
            }
        },

        async revoke_complete() {
            if (!this.state.commission.finished) {
                const user_id = this.state._current_user._id
                const stage = this.state.commission.stage
                if (stage.type !== 'complete') {
                    throw Error(
                        'Revoke complete can only be done in the complete phase'
                    )
                }
                let complete_data = {
                    confirmed: [],
                }
                if (stage.data) {
                    complete_data = { ...stage.data }
                }

                complete_data.confirmed = complete_data.confirmed.filter(
                    v => v !== user_id
                )

                let r = await update_db({
                    model: 'CommissionPhase',
                    data: { _id: stage._id, data: complete_data },
                    schema: commission_schema,
                    validate: true,
                })

                await this.refresh()
                return r
            }
        },

        get_next_stages() {
            let d_stages: CommissionProcessType[] = this.state.stages.filter(
                v => !v.done
            )
            return d_stages
        },

        async next_phase() {
            let d_stages: CommissionProcessType[] = this.get_next_stages()

            if (d_stages.length) {
                const skippable: CommissionPhaseType[] = [
                    CommissionPhaseT.refund,
                    CommissionPhaseT.reopen,
                    CommissionPhaseT.revision,
                    CommissionPhaseT.cancel,
                ]

                while (d_stages.length) {
                    let next_v = d_stages.shift()
                    if (skippable.includes(next_v.type)) {
                        await this.complete_default_stage(next_v)
                    } else {
                        if (next_v.type === 'unlock') {
                            this.unlock()
                        } else {
                            return await this.add_phase(next_v, {
                                done: false,
                                complete_previous_phase: true,
                            })
                        }
                        break
                    }
                }
            }
        },

        async complete() {
            const user_id = this.state._current_user._id
            const stage = this.state.commission.stage
            if (stage.type !== 'complete') {
                throw Error('Complete can only be done in the complete phase')
            }
            let stage_data = {
                confirmed: [],
            }
            if (stage.data) {
                stage_data = { ...stage.data }
            }

            stage_data.confirmed = [user_id, ...stage_data.confirmed].reduce(
                (unique, item) =>
                    unique.includes(item) ? unique : [...unique, item],
                []
            )

            let r = await update_db({
                model: 'CommissionPhase',
                data: { _id: stage._id, data: stage_data },
                schema: commission_schema,
                validate: true,
            })
            if (r.status) {
                let participants = [
                    this.state.commission.from_user._id,
                    this.state.commission.to_user._id,
                ]
                if (participants.every(v => stage_data.confirmed.includes(v))) {
                    this.complete_phase()
                    r = await this.end(true)
                }
            }
            await this.refresh()
            return r
        },

        async decline() {
            this.complete_phase()
            let r = await this.update({
                accepted: false,
                ...this._end(),
            })
            return r
        },

        _end(successfully?: boolean) {
            return {
                finished: true,
                completed: successfully ? true : false,
                end_date: new Date(),
            }
        },
        async end(successfully?: boolean) {
            return await this.update(this._end(successfully))
        },

        async load_products(commission_id: string) {

            const comm_select = 'products'
            const p = "products"
            if (is_server()) {
                try {
                    const r = await Commission.findById(commission_id)
                        .populate(p).select(comm_select)
                    return r.toJSON()?.products
                } catch (err) {
                    log.error(err)
                    return null
                }
            } else {
                return await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Commission',
                        method: 'findById',
                        query: commission_id,
                        lean: false,
                        populate: p,
                        select: comm_select
                    },
                }).then(async r => {
                    if (r.ok) {
                        return (await r.json()).data?.products
                    }
                    return null
                })
            }
        },

        async load(commission_id: string) {
            const phase_select = 'user done done_date type title data'

            const comm_select = '-products'
            const p = [
                {
                    path: 'to_user',
                    populate: [
                        {
                            path: 'avatar',
                        },
                    ]
                },
                {
                    path: 'from_user',
                    populate: [
                        {
                            path: 'avatar',
                        },
                    ]
                },
                { path: 'drafts' },
                { path: 'attachments' },
                { path: 'phases', select: phase_select },
                { path: 'stage', select: phase_select },
            ]
            if (is_server()) {
                try {
                    const r = await Commission.findById(commission_id)
                        .populate(p).select(comm_select)
                    return r.toJSON()
                } catch (err) {
                    log.error(err)
                    return null
                }
            } else {
                return await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'Commission',
                        method: 'findById',
                        query: commission_id,
                        lean: false,
                        populate: p,
                        select: comm_select
                    },
                }).then(async r => {
                    if (r.ok) {
                        return (await r.json()).data
                    }
                    return null
                })
            }
        },

        get_stages_limits() {
            let limit = {}
            limit[CommissionPhaseT.pending_approval] = 1
            limit[CommissionPhaseT.pending_sketch] = Number.POSITIVE_INFINITY
            limit[CommissionPhaseT.revision] = Number.POSITIVE_INFINITY
            limit[CommissionPhaseT.pending_payment] = 1
            limit[CommissionPhaseT.pending_product] = Number.POSITIVE_INFINITY
            limit[CommissionPhaseT.unlock] = 1
            limit[CommissionPhaseT.complete] = 1
            return limit
        },

        get_stages_collections() {
            let cols = {}
            commission_phases.forEach(v => {
                switch (v) {
                    case 'pending_approval':
                        cols[v] = 1
                        break
                    case 'unlock':
                        cols[v] = 3
                        break
                    case 'complete':
                        cols[v] = 4
                        break
                    default:
                        cols[v] = 2
                }
            })
            return cols
        },

        process_stages(stages: CommissionProcessType[]) {
            const limit = useCommissionStore.actions.get_stages_limits()

            let p_stages: CommissionProcessType[] = []

            let c_limit = {}
            stages.forEach(v => {
                if (c_limit[v.type]) {
                    if (c_limit[v.type] >= limit[v.type]) {
                        return
                    }
                }

                if (c_limit[v.type]) {
                    c_limit[v.type]++
                } else {
                    c_limit[v.type] = 1
                }
                p_stages.push(v)
            })

            const cols = useCommissionStore.actions.get_stages_collections()

            p_stages.sort((a, b) => {
                if (cols[a.type] > cols[b.type]) {
                    return 1
                } else if (cols[a.type] < cols[b.type]) {
                    return -1
                } else {
                    return 0
                }
            })

            return p_stages
        },
        is_unlocked(user, commission) {
            let is_owner = user?._id.toString() === commission.from_user._id.toString()
            let unlocked = !is_owner

            if (is_owner && commission.phases.some(v => {
                if (v.type === 'unlock' && v.done) {
                    return true
                }
                return false
                })) {
                    unlocked = true
            }

            return unlocked
        },
        get_commission_count: useUserStore.actions.get_commission_count,
    }
)

export const useCommissionsStore = createStore(
    {
        commissions: undefined,
    },
    {
        sent_commissions(user_id) {
            return this.state.commissions.filter(
                d => d.from_user._id === user_id
            )
        },
        received_commissions(user_id) {
            return this.state.commissions.filter(
                d => d.to_user._id === user_id && d.accepted
            )
        },
        get_title(user_id, commission) {
            const owner = commission.from_user._id === user_id
            return owner
                ? commission.from_title
                : commission.to_title
                ? commission.to_title
                : commission.from_title
        },
        parse_search_query(
            user,
            type: 'received'|'sent',
            search_query,
            page: number,
            build = true,
            { ongoing = false, completed = false, failed = false, rejected = false, expired = false, accepted = false, not_accepted = false } = {}
        ) {
            let q = bodybuilder()

            q = q.sort("updated", "desc")
            // q = q.sort("to_title", "asc")
            q = q.sort("from_title.keyword", "asc")

            if (type === 'received') {
                q = q.query('match', 'to_user', user._id.toString())
            } else if (type === 'sent') {
                q = q.query('match', 'from_user', user._id.toString())
            }
            if (not_accepted) {
                q = q.query('match', 'accepted', false)
            }
            if (accepted) {
                q = q.query('match', 'accepted', true)
            }
            if (ongoing) {
                q = q.query('match', 'finished', false)
            }
            if (completed) {
                q = q.query('match', 'completed', true)
            }
            if (rejected) {
                q = q.query('match', 'finished', true)
                q = q.query('match', 'accepted', false)
            }
            if (failed) {
                q = q.query('match', 'completed', false)
                q = q.query('match', 'finished', true)
            }
            if (expired) {
                q = q.query('match', 'finished', true)
                q = q.query('exists', 'expire_date')
            }

            if (search_query) {
                q = q.query('multi_match', {
                    query: search_query,
                    fields: ['to_title', 'from_title'],
                })
            }

            // TODO: use n-gram tokenizer for substring search

            const limit = 30

            q = q.from(page * limit).size(limit)

            return build ? q.build() : q
        },
        async query_commissions(type: 'commissions' | 'requests', user, is_creator, query, page = 0) {

            let listtype = query.type ?? (is_creator ? 'received' : 'sent')

            let btn_state

            if (type === 'commissions') {
                btn_state = {
                    accepted: is_creator ? true : false,
                    all: false,
                    ongoing: query.ongoing === 'true',
                    completed: query.completed === 'true',
                    rejected: query.rejected === 'true',
                    failed: query.failed === 'true',
                    expired: query.expired === 'true',
                }
            } else if (type === 'requests') {
                btn_state = {
                    accepted: false,
                    not_accepted: true,
                    all: false,
                    ongoing: query.active === 'true',
                    failed: query.failed === 'true',
                    rejected: query.rejected === 'true',
                    expired: query.expired === 'true',
                }
            }

            if (!Object.values(btn_state).some(Boolean)) {
                btn_state.all = true
            }

            return await useCommissionsStore.actions.search_commissions(
                user,
                listtype,
                query.commissions_q,
                page,
                btn_state
            )

        },
        async search_commissions(
            user,
            type: 'received'|'sent',
            search_query,
            page,
            { ongoing = false, completed = false, failed = false, rejected = false, expired = false, accepted = false, not_accepted = false, active = true } = {}
        ) {
            let r = []
            let q = this.parse_search_query(user, type, search_query, page, false, {
                ongoing,
                completed,
                failed,
                expired,
                accepted,
                rejected,
                not_accepted,
                active,
            })

            let opt = {
                hydrate: true,
                hydrateOptions: {
                    lean: true,
                    populate: [
                        {
                            path: 'to_user',
                            populate: [
                                {
                                    path: 'avatar',
                                },
                            ]
                        },
                        {
                            path: 'from_user',
                            populate: [
                                {
                                    path: 'avatar',
                                },
                            ]
                        }
                    ],
                },
            }
            let d: any

            if (is_server()) {
                try {
                    d = await promisify_es_search(Commission, q.build(), opt)
                } catch (err) {
                    log.error(err)
                }
            } else {
                d = await fetch('/api/esearch', {
                    method: 'post',
                    body: {
                        model: 'Commission',
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
                r = d.hits.hits
            }

            return r
        },
    }
)

export const useCommissionRateStore = createStore(
    {
        rates: [],
        options: [],
        licenses: [],
    },
    {
        async create_rate(data, params: object = undefined) {
            let r = await update_db({
                model: 'CommissionRate',
                data: data,
                schema: comission_rate_schema,
                create: true,
                validate: true,
                populate: ['extras', 'user'],
                ...params,
            })
            if (r.status) {
                this.setState({
                    rates: iupdate(
                        this.state.rates.filter(v => v._id != r.body.data._id),
                        { $push: [r.body.data] }
                    ),
                })
            }
            return r
        },
        async delete_rate(id, params: object = undefined) {
            let r = await update_db({
                model: 'CommissionRate',
                data: { _id: id },
                schema: comission_rate_schema,
                delete: true,
                ...params,
            })
            if (r.status) {
                this.setState({
                    rates: this.state.rates.filter(v => v._id != id),
                })
            }
            return r
        },
        async delete_option(id, params: object = undefined) {
            let r = await update_db({
                model: 'CommissionExtraOption',
                data: { _id: id },
                schema: commission_extra_option_schema,
                delete: true,
                ...params,
            })
            if (r.status) {
                this.setState({
                    options: this.state.options.filter(v => v._id != id),
                })
            }
            return r
        },
        async update_option(data: object, params: object = undefined) {
            let r = await update_db({
                model: 'CommissionExtraOption',
                data: data,
                schema: commission_extra_option_schema,
                create: true,
                validate: true,
                ...params,
            })
            if (r.status) {
                this.setState({
                    options: iupdate(
                        this.state.options.filter(
                            v => v._id != r.body.data._id
                        ),
                        { $push: [r.body.data] }
                    ),
                })
            }
            return r
        },
        async update_license(data: object, params: object = undefined) {
            let r = await update_db({
                model: 'License',
                data: data,
                schema: license_schema,
                create: true,
                validate: true,
                ...params,
            })
            if (r.status) {
                this.setState({
                    licenses: iupdate(
                        this.state.licenses.filter(
                            v => v._id != r.body.data._id
                        ),
                        { $push: [r.body.data] }
                    ),
                })
            }
            return r
        },
        async delete_license(id, params: object = undefined) {
            let r = await update_db({
                model: 'License',
                data: { _id: id },
                schema: license_schema,
                delete: true,
                ...params,
            })
            if (r.status) {
                this.setState({
                    licenses: this.state.licenses.filter(v => v._id != id),
                })
            }
            return r
        },
        async get_rate(rate_id) {
            let r
            let rate_q = { _id: rate_id }
            let p = [
                { path: 'extras' },
                { path: 'user', select: "username" },
                { path: 'image' },
            ]

            if (is_server()) {
                r = CommissionRate.findOne(rate_q)
                    .populate(p)
                    .lean()
            } else {
                r = await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'CommissionRate',
                        query: rate_q,
                        method: 'findOne',
                        populate: p,
                    },
                }).then(async r => {
                    if (r.ok) {
                        return (await r.json()).data
                    } else {
                        return null
                    }
                })
            }
            return r
        },
        async get_extraoptions(ids: string[]) {
            let r
            let extra_option_q = { _id: { $in: ids } }

            if (is_server()) {
                r = CommissionExtraOption.find(extra_option_q).lean()
            } else {
                r = await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'CommissionExtraOption',
                        query: extra_option_q,
                    },
                }).then(async r => {
                    if (r.ok) {
                        return (await r.json()).data
                    } else {
                        return null
                    }
                })
            }
            return r
        },
        async load(profile_user, { options = true, rates = true, licenses = true, populate_license = false} = {}) {
            let state = {
                options: [],
                rates: [],
                licenses: []
            }

            let a, b, c

            let license_q = { user: profile_user._id }

            let extra_option_q = { user: profile_user._id }

            let rate_q = { user: profile_user._id }
            let rate_p = [
                {path: 'extras'},
                {path: 'user', select: "username"},
                {path: 'image'},
            ]

            if (populate_license) {
                rate_p.push({path: 'license'})
            }

            if (is_server()) {
                if (licenses) {
                    c = License.find(license_q)
                        .lean()
                        .then(d => {
                            state.licenses = [...d]
                        })
                }

                if (options) {
                    a = CommissionExtraOption.find(extra_option_q)
                        .lean()
                        .then(d => {
                            state.options = [...d]
                        })
                }

                if (rates) {
                    b = CommissionRate.find(rate_q)
                        .populate(rate_p)
                        .lean()
                        .then(d => {
                            state.rates = [...d]
                        })
                }
            } else {
                if (licenses) {
                    c = fetch('/api/fetch', {
                        method: 'post',
                        body: {
                            model: 'License',
                            query: license_q,
                        },
                    }).then(async r => {
                        if (r.ok) {
                            state.licenses = [...(await r.json()).data]
                        }
                    })
                }

                if (options) {
                    a = fetch('/api/fetch', {
                        method: 'post',
                        body: {
                            model: 'CommissionExtraOption',
                            query: extra_option_q,
                        },
                    }).then(async r => {
                        if (r.ok) {
                            state.options = [...(await r.json()).data]
                        }
                    })
                }

                if (rates) {
                    b = fetch('/api/fetch', {
                        method: 'post',
                        body: {
                            model: 'CommissionRate',
                            query: rate_q,
                            populate: rate_p,
                        },
                    }).then(async r => {
                        if (r.ok) {
                            state.rates = [...(await r.json()).data]
                        }
                    })
                }
            }

            await a
            await b
            await c

            return state
        },
    }
    //   async (store) => {
    //       await bootstrapStoreDev({useCommissionRateStore: store})
    //   }
)
