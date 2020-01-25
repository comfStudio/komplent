import fs from 'fs'
import path from 'path'

import { Commission, CommissionPhase, Payment, Attachment } from "@db/models"
import { decimal128ToFloat, user_among } from "@utility/misc"
import { upload_file } from '@services/aws'
import log from '@utility/log'
import { schedule_unique, remove_unique_task, schedule_unique_now } from '@server/tasks'
import { TASK, CommissionPhaseT, CommissionPhaseType } from '@server/constants'
import fairy from '@server/fairy'
import { addDays } from 'date-fns'
import { CommissionProcessType } from '@schema/user'
import { commission } from '@utility/pages'

export class CommissionProcess {

    static async _load_commission(user, commission_id, handler: "client" | "creator" = undefined) {
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
            { path: 'phases' },
            { path: 'stage' },
        ]

        const commission = await Commission.findById(commission_id).populate(p).select("-products")
        if (!commission) {
            throw Error("commission not found")
        }

        if (handler) {
            if (handler === "client") {
                user_among(user, commission.from_user)
            } else {
                user_among(user, commission.to_user)
            }
        }
        return commission
    }

    static async _complete_phase(commission, done = true) {
        commission.stage.done = done
        commission.stage.done_date = done ? new Date() : null
        await commission.stage.save()

        return true
    }

    static _end_data(successfully?: boolean) {
        return {
            finished: true,
            completed: successfully ? true : false,
            end_date: new Date(),
        }
    }

    static _end(commission, successfully?: boolean) {
        commission.set({
            ...this._end_data(successfully)
        })
    }

    static _get_next_stages(commission) {
        let d_stages: CommissionProcessType[] = commission.commission_process.filter(
            v => !v.done
        )
        return d_stages
    }

    static async _unlock(user, commission) {

        await this._add_phase(user, commission, 'unlock', {
            done: true,
        })

        await this._add_phase(user, commission, 'complete', {
            complete_previous_phase: false,
        })

        return commission
    }

    static _complete_default_stage(
        commission,
        on_stage: CommissionPhaseType | CommissionProcessType = undefined
    ) {
        if (typeof on_stage === 'object') {
            on_stage = on_stage.type
        }
        let set = false
        commission.commission_process.forEach(v => {
            if (!v.done && !set && (!on_stage || on_stage === v.type)) {
                set = true
                v.done = true
            }
        })
        commission.markModified("commission_process")
        return commission
    }

    static async _add_phase(
        user,
        commission,
        type: CommissionPhaseType | CommissionProcessType,
        {
            complete_previous_phase = true,
            done = false,
            data = undefined,
        } = {}
    ) {
        if (complete_previous_phase) {
            await this._complete_phase(commission, true)
        }

        this._complete_default_stage(commission)
        
        if (typeof type === 'object') {
            type = type.type
        }

        const next_stages = this._get_next_stages(commission)
        if (!next_stages.length || next_stages[0].type !== type ) {
            log.warn(`Commission ${commission._id} expected next phase to be ${next_stages?.[0]?.type} not ${type}`)
            return
        }

        const phase = new CommissionPhase({
            type,
            commission: commission._id,
            done,
            done_date: done ? new Date() : undefined,
            data: data,
            user: user._id,
        })
        await phase.save()
        commission.phases.push(phase)
        // eslint-disable-next-line
        commission.stage = phase

        schedule_unique({
            key: commission._id.toString(),
            when: "2 minutes",
            task: TASK.commission_phase_updated,
            data: {
                user_id: user._id,
                from_user_id: commission.from_user._id,
                to_user_id: commission.to_user._id,
                commission_id: commission._id,
                phase: phase.toJSON(),
            }
        })

        return commission
    }

    static async _next_phase(user, commission) {
        let d_stages: CommissionProcessType[] = this._get_next_stages(commission)


        if (d_stages.length) {
            const skippable: CommissionPhaseType[] = [
                CommissionPhaseT.refund,
                CommissionPhaseT.reopen,
                CommissionPhaseT.revision,
                CommissionPhaseT.cancel,
            ]

            while (d_stages.length && d_stages[0].type === commission.stage.type) {
                await this._complete_phase(commission, true)
                d_stages.shift()
            }

            while (d_stages.length) {
                let next_v = d_stages.shift()
                if (skippable.includes(next_v.type)) {
                    this._complete_default_stage(commission, next_v)
                } else {
                    if (next_v.type === 'unlock') {
                        this._unlock(user, commission)
                    } else {
                        return await this._add_phase(user, commission, next_v, {
                            done: false,
                            complete_previous_phase: false,
                        })
                    }
                    break
                }
            }
        }
    }

    static _exhaust_revisions(commission) {
        let d_stages: CommissionProcessType[] = this._get_next_stages(commission)
        if (d_stages.length) {
            let n = d_stages.shift()
            while (n.type === 'revision') {
                n = null
                this._complete_default_stage(commission)
                if (d_stages) {
                    n = d_stages.shift()
                }
            }
        }
    }

    static async decline_commission(user, commission_id: string) {
        const commission = await this._load_commission(user, commission_id, "creator")
        await this._complete_phase(commission)
        commission.set({
            accepted: false,
            ...this._end_data(false)
        })
        await commission.save()
        return await this._load_commission(user, commission_id)
    }

    static async accept_commission(user, commission_id: string) {
        const commission = await this._load_commission(user, commission_id, "creator")

        commission.set({
            accepted: true,
        })

        await this._next_phase(user, commission)

        await commission.save()

        return commission
    }

    static async skip_drafts(user, commission_id: string) {
        const commission = await this._load_commission(user, commission_id)

        await this._next_phase(user, commission)

        await commission.save()

        return commission
    }

    static async confirm_drafts(user, commission_id: string) {
        const commission = await this._load_commission(user, commission_id)

        this._exhaust_revisions(commission)

        await this._next_phase(user, commission)

        await commission.save()
        
        return commission
    }

    static async confirm_products(user, commission_id: string) {
        const commission = await this._load_commission(user, commission_id)

        this._exhaust_revisions(commission)

        await this._next_phase(user, commission)

        await commission.save()
        
        return commission
    }

    static async complete(user, commission_id: string) {
        const commission = await this._load_commission(user, commission_id)

        const stage = commission.stage
        if (stage.type !== 'complete') {
            throw Error('Complete can only be done in the complete phase')
        }

        if (stage.done) {
            throw Error('Commission is already completed')
        }

        let stage_data = {
            confirmed: [],
        }
        if (stage.data) {
            stage_data = { ...stage.data }
        }

        stage_data.confirmed = [user._id, ...stage_data.confirmed].reduce(
            (unique, item) =>
                unique.includes(item) ? unique : [...unique, item],
            []
        )

        stage.data = stage_data
        stage.markModified("data")

        await stage.save()

        let participants = [
            commission.from_user._id,
            commission.to_user._id,
        ]

        if (participants.every(v => stage_data.confirmed.includes(v))) {
            this._complete_phase(commission, true)
            this._end(commission, true)
        }

        await commission.save()

        return await this._load_commission(user, commission_id)
    }

    static async revoke_complete(user, commission_id: string) {
        const commission = await this._load_commission(user, commission_id)
        
        if (!commission.finished) {
            const stage = commission.stage
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
                v => v !== user._id
            )

            stage.data = complete_data
            stage.markModified("data")

            await stage.save()

            return await this._load_commission(user, commission_id)
        }
    }

    static async cancel(user, commission_id: string) {
        const commission = await this._load_commission(user, commission_id)

        if (!commission.payments.length) {
            let r = await this._add_phase(user, commission, 'cancel', {
                done: true,
                complete_previous_phase: false,
            })
            await this._end(commission, false)
            await commission.save()
        } else {
            throw Error("Cannot cancel a request that has had a transaction")
        }
        return commission
    }

    static async confirm_revision(user, commission_id: string) {
        const commission = await this._load_commission(user, commission_id)

        const stage = commission.stage
        if (stage.type !== 'revision') {
            throw Error('Revision can only be done in the revision phase')
        }
        let stage_data = {
            confirmed: [],
        }
        if (stage.data) {
            stage_data = { ...stage.data }
        }

        stage_data.confirmed = [user._id, ...stage_data.confirmed].reduce(
            (unique, item) =>
                unique.includes(item) ? unique : [...unique, item],
            []
        )

        commission.stage.data = stage_data
        commission.stage.markModified("data")
        await commission.stage.save()

        let participants = [
            commission.from_user._id,
            commission.to_user._id,
        ]
        if (participants.every(v => stage_data.confirmed.includes(v))) {
            await this._next_phase(user, commission)
        }
        return await this._load_commission(user, commission_id)
    }

    static async can_request_revision(user, commission_id: any) {
        let commission
        if (typeof commission_id === 'string') {
            commission = await this._load_commission(user, commission_id)
        } else {
            commission = commission_id
        }
        
        
        if (commission.stage.type === 'pending_sketch' || commission.stage.type === 'pending_product') {
            const next_stages = this._get_next_stages(commission)
            if (next_stages.length && next_stages[0].type === "revision" && next_stages[0].data.count) {
                return true
            }
        } else if (commission.stage.type === 'revision') {
            if (commission.stage.data.count) {
                return true
            }
        }

        return false
    }

    static async request_revision(user, commission_id: string) {
        const commission = await this._load_commission(user, commission_id)
        let err = false

        if (await this.can_request_revision(user, commission)) {
            const next_stages = this._get_next_stages(commission)
            const rev = next_stages[0]
            if (commission.stage.type !== "revision"){
                await this._add_phase(user, commission, 'revision', {
                    data: { confirmed: [], count: rev.count },
                })
            } else if (commission.stage.type === "revision") {
                if (commission.stage.data.count) {
                    commission.stage.data.count--
                    commission.stage.markModified("data")
                    await commission.stage.save()
                } else {
                    err = true
                }
            } else {
                err = true
            }
        } else {
            err = true
        }
        if (err) {
            throw Error("no revision is allowed")
        }

        return await this._load_commission(user, commission_id) 
    }
}


function _get_stage_index(stage_type: CommissionPhaseType, stages: CommissionProcessType[], {skip_first = 0, reversed = false} = {}) {
    let skipped = 0
    if (reversed) {
        for (let idx = stages.length - 1; idx > 0; idx--) {
            if (stages[idx].type === stage_type) {
                if (skip_first && skip_first < skipped) {
                    skipped++
                    continue
                }
                return idx
            }
        }
    } else {
        for (let idx = 0; idx < stages.length; idx++) {
            if (stages[idx].type === stage_type) {
                if (skip_first && skip_first < skipped) {
                    skipped++
                    continue
                }
                return idx
            }
        }
    }
    return null
}

export const get_stages_limits = (user) => {
    let limit = {}
    limit[CommissionPhaseT.pending_approval] = 1
    limit[CommissionPhaseT.pending_sketch] = Number.POSITIVE_INFINITY
    limit[CommissionPhaseT.revision] = Number.POSITIVE_INFINITY
    limit[CommissionPhaseT.pending_payment] = Number.POSITIVE_INFINITY
    limit[CommissionPhaseT.pending_product] = Number.POSITIVE_INFINITY
    limit[CommissionPhaseT.unlock] = 1
    limit[CommissionPhaseT.complete] = 1

    let minimum = {}
    minimum[CommissionPhaseT.pending_approval] = 1
    minimum[CommissionPhaseT.pending_sketch] = 0
    minimum[CommissionPhaseT.revision] = 0
    minimum[CommissionPhaseT.pending_payment] = 0
    minimum[CommissionPhaseT.pending_product] = 1
    minimum[CommissionPhaseT.unlock] = 1
    minimum[CommissionPhaseT.complete] = 1

    return {limit, minimum}
}

export const process_commission_stages = (user, stages: CommissionProcessType[]) => {
    log.debug(`Processing commission stages: ${stages.map(v => v.type)}`)
    const { limit, minimum } = get_stages_limits(user)

    let p_stages: CommissionProcessType[] = []

    // make sure the the stages don't surpass the limits

    let c_limit = {}
    stages.forEach(v => {
        if (!v.type) {
            return
        }

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

    log.debug(`Removed redundant commission stages: ${p_stages.map(v => v.type)}`)

    // add missing

    for (let key in minimum) {
        const min = minimum[key]

        if (min && (!c_limit[key] || c_limit[key] < min)) {
            switch (key) {
                case CommissionPhaseT.pending_approval:
                    p_stages.unshift({ type: CommissionPhaseT.pending_approval, done: false })
                    break;

                case CommissionPhaseT.pending_product: {
                    const phase = { type: CommissionPhaseT.pending_product, done: false }
                    // add after first draft
                    const draft_idx = _get_stage_index(CommissionPhaseT.pending_sketch, p_stages)
                    if (draft_idx !== null) {
                        p_stages.splice(draft_idx+1, 0, phase)
                        break
                    }
                    // add after approval
                    const approval_idx = _get_stage_index(CommissionPhaseT.pending_approval, p_stages)
                    if (approval_idx !== null) {
                        p_stages.splice(approval_idx+1, 0, phase)
                        break
                    }

                    // add at front
                    p_stages.unshift(phase)
                    break
                }

                case CommissionPhaseT.unlock: {
                    const phase = { type: CommissionPhaseT.unlock, done: false }
                    const complete_idx = _get_stage_index(CommissionPhaseT.complete, p_stages)
                    if (complete_idx !== null) {
                        p_stages.splice(complete_idx, 0, phase)
                    } else {
                        p_stages.push(phase)
                    }
                    break
                }

                case CommissionPhaseT.complete:
                    p_stages.push({ type: CommissionPhaseT.complete, done: false })
                    break
            
                default:
                    break;
            }
        }
    }

    log.debug(`Added required commission stages: ${p_stages.map(v => v.type)}`)

    // move around

    function remove_duplicate(vtype: CommissionPhaseType) {
        const v_idx = _get_stage_index(vtype, p_stages)
        if (!v_idx != null) {
            // remove if two types are next to each other
            if (p_stages?.[v_idx+1]?.type === vtype) {
                p_stages.splice(v_idx, 1)
                return true
            }
        }
    }

    let no_duplicate_types = [
        CommissionPhaseT.revision,
        CommissionPhaseT.pending_product,
        CommissionPhaseT.pending_sketch,
        CommissionPhaseT.pending_payment
    ]

    while (no_duplicate_types.length) {
        if (!remove_duplicate(no_duplicate_types[0])) {
            no_duplicate_types.shift()
        }
    }

    const last_asset_idx = _get_stage_index(CommissionPhaseT.pending_product, p_stages, {reversed: true})
    const last_draft_idx = _get_stage_index(CommissionPhaseT.pending_sketch, p_stages, {reversed: true})

    // make sure asset is always in front of draft
    if (last_asset_idx != null && last_draft_idx != null) {
        if (last_draft_idx > last_asset_idx) {
            const v = p_stages.splice(last_draft_idx, 1)[0]
            p_stages.splice(last_asset_idx, 0, v)
        }
    }

    log.debug(`Moved around commission stages: ${p_stages.map(v => v.type)}`)

    return p_stages
}

export const add_commission_asset = async (user, commission, file) => {

    user_among(user, commission.to_user)

    const filestream = fs.createReadStream(file.path)
    const r = await upload_file(filestream, path.basename(file.path)).finally(() => {
        filestream.destroy()
    })
    
    if (r) {
        const asset = new Attachment({ name: file.name, url: r.Location, key: r.Key, allowed_users: [user._id, commission.from_user] })
        await asset.save()
        commission.products.push(asset)
        await commission.save()
        log.debug(`Asset added to commission ${commission._id}`)
        return asset
    } else {
        throw Error("no asset was added")
    }

}

export const remove_commission_asset = async (user, commission_id: string, asset_ids: string[], key=undefined) => {

    key = key ?? "products"

    const commission = await Commission.findById(commission_id)

    if (!commission) {
        throw Error("no commission found")
    }

    user_among(user, key === 'attachments' ? commission.from_user : commission.to_user)

    for (let aid of asset_ids) {
        if (commission[key].includes(aid)) {
            await Attachment.findByIdAndDelete(aid)
            commission[key].remove(aid)
        } else {
            throw Error("permission error")
        }
    }

    await commission.save()

    return true
}

export const pay_commission = async (user, commission_id, payment_phase_id) => {

    let c = await CommissionProcess._load_commission(user, commission_id, "client")
    if (c) {
        user_among(user, c.from_user)
        let p = await CommissionPhase.findById(payment_phase_id)
        if (p) {
            let payment = new Payment({
                from_user: c.from_user,
                to_user: c.to_user,
                price: c.rate.price,
                status: "completed"
            })
            await payment.save()
            c.payments = [...c.payments, payment._id]
            await CommissionProcess._next_phase(user, c)
            await c.save()
            return c
        }
    }
    throw Error("No commission or payment phase with given IDs found")
}

export const suggest_commission_price = async (user, commission_id, new_price: number) => {
    let c = await Commission.findById(commission_id)
    user_among(user, [c.to_user, c.from_user])
    if (c) {
        const valid_price = decimal128ToFloat(c.suggested_price) !== new_price && typeof new_price === 'number' && new_price >= 0
        const valid_user = [c.to_user._id.toString(), c.from_user._id.toString()].includes(user._id.toString())
        if (valid_price && valid_user) {
            c.suggested_price = new_price
            c.suggested_price_user = user
            await c.save()
            return true
        }
    } else {
        throw Error("No commission found")
    }
    return false
}

export const accept_commission_price = async (user, commission_id) => {
    let c = await Commission.findById(commission_id)
    user_among(user, c.suggested_price_user)
    if (c) {
        c.rate = { ...c.rate, price: c.suggested_price }
        await c.save()
        return true
    } else {
        throw Error("No commission found")
    }
    return false

}

const schedule_expire_deadline = (commission_id: string, created: Date, deadline: number) => {
    if (deadline && deadline > 0) {
        if (addDays(created, deadline) < (new Date())) {
            return schedule_unique_now({
                task: TASK.commission_request_deadline,
                key: commission_id.toString(),
                data: {
                    commission_id,
                },
            })
        } else {
            return schedule_unique({
                task: TASK.commission_request_deadline,
                key: commission_id.toString(),
                when: `${deadline} days`,
                data: {
                    commission_id,
                },
            })
        }
    } else {
        remove_unique_task(TASK.commission_request_deadline, commission_id)
    }
}

export const create_commission = async (from_user, data: any) => {

    const c = new Commission(data)

    await c.save()

    schedule_expire_deadline(c._id, c.created, from_user.request_expire_deadline)

    return c
}

export const update_requests_expire_deadline = async (user_id: string, new_deadline: number) => {

    const requests = await Commission.find({to_user: user_id, finished: false, accepted: false}).select("_id created").lean()

    requests.forEach(c => {
        schedule_expire_deadline(c._id, c.created, new_deadline)
    });

}

export const configure_commission_fairy_handlers = () => {
    
    fairy()?.on("user_request_expire_deadline_changed", (user, new_deadline) => {
        update_requests_expire_deadline(user._id, new_deadline)
    })

}