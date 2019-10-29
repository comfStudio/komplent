import { createStore, bootstrapStoreDev } from '@client/store'
import { update_db } from '@app/client/db'
import { comission_rate_schema, commission_extra_option_schema, commission_schema } from '@schema/commission'
import { iupdate, is_server } from '@utility/misc'
import { CommissionExtraOption, CommissionRate, Commission } from '@db/models';
import { fetch } from '@utility/request';

export const useCommissionStore = createStore(
    {
        commission: undefined,
        _current_user: {} as any,
    },
    {
        get_commission() {
            let c
            if (this.state.commission) {
                c = {
                    ...this.state.commission,
                    rate: {...this.state.commission.rate, price: {$numberDecimal: this.state.commission.rate.price}},
                    extras: this.state.commission.extras ? this.state.commission.extras.map(v => ({...v, price: {$numberDecimal: v.price}})) : this.state.commission.extras
                }

            }
            return c || {}
        },
        async create_commission(data, ...params) {

            let d = {...data}
            
            if (typeof d.rate === 'string') {
                d.rate = await useCommissionRateStore.actions.get_rate(d.rate)
            }

            if (!d.rate) {
                throw Error("A valid commission rate is required")
            }

            if ( typeof d.rate === 'object') {
                d.rate.price = d.rate.price['$numberDecimal']
            }

            if (d.extras && typeof d.extras[0] === 'string') {
                d.extras = await useCommissionRateStore.actions.get_extraoptions(d.extras)
            }

            if (d.extras) {
                d.extras = d.extras.map(v => ({...v, price: v.price['$numberDecimal']}))
            }

            let r = await update_db({
                model:'Commission',
                data:d,
                schema:commission_schema,
                create: true,
                validate: true,
                ...params})
            if (r.status) {
                this.setState({commission: r.body.data})
            }
            return r
          },

        async update(data: any, ...params) {
            data._id = this.state.commission._id
            const r = await update_db({
                model: "Commission",
                data: data,
                schema: commission_schema,
                validate: true,
                ...params
            })
            if (r.status) {
                await this.refresh()
            }
            return r
        },

        async refresh() {
            let rc = await this.load(this.state.commission._id)
            if (rc) {
                this.setState({commission: rc})
            }
            return rc
        },

        async complete_phase(done=true) {
            let r = await update_db({
                model: "CommissionPhase",
                data: {_id: this.state.commission.stage._id, done, done_date: done? new Date() : null},
                schema: commission_schema,
                validate: true,
            })
            this.refresh()
            return r
        },

        async add_phase(type: 'pending_approval'|'pending_payment'|'pending_product'|'complete'|'cancel'|'reopen'|'refund', {complete_previous_phase=true, refresh = false, done = false, params = {}, data = undefined} = {}) {
            if (complete_previous_phase) {
                this.complete_phase()
            }
            let r = await update_db({
                model: "CommissionPhase",
                data: {
                    type,commission:
                    this.state.commission._id,
                    done,
                    done_date: done ? new Date() : undefined,
                    data: data,
                    user: this.state._current_user._id},
                schema: commission_schema,
                validate: true,
                create: true,
                ...params
            })
            if (refresh && r.status) {
                this.refresh()
            }
            return r
        },

        async pay(phase_data: any) {
            let r
            if (!this.state.commission.payment) {
                r = await this.update({
                    payment: true,
                })
            }
            const last: boolean = phase_data.data ? phase_data.data.last : false
            if (last) {
                this.unlock()
            } else {
                r = await this.add_phase("pending_product")
            }
            return r
        },

        async unlock() {
            let r = await this.add_phase("unlock", {done: true, refresh: false})
            r = await this.add_phase("complete", {complete_previous_phase: false})
            return r
        },

        async add_payment_phase(last = false) {
            let count = 0
            for (let p of this.state.commission.phases.filter((v) => v.type === 'pending_payment')) {
                count += 1
            }
            let r = await this.add_phase("pending_payment", {data: {count: count + 1, last: last}})
            return r
        },

        async accept() {
            let r = await this.update({
                accepted: true,
            })
            if (r.status) {
                if (this.state.commission.payment_position === 'first') {
                    r = await this.add_payment_phase(false)
                } else {
                    r = await this.add_phase("pending_product")
                }
            }
            return r
        },

        async confirm_products() {
            let r
            if (this.state.commission.payment_position === 'last') {
                r = await this.add_payment_phase(true)
            } else {
                r = await this.unlock()
            }
            return r
        },

        async cancel() {
            let r = await this.add_phase("cancel", {done: true, complete_previous_phase: false})
            if (r.status) {
                r = await this.end()
            }
            return r
        },

        async revoke_complete() {
            const user_id = this.state._current_user._id
            const stage = this.state.commission.stage
            if (stage.type !== "complete") {
                throw Error("Revoke complete can only be done in the complete phase")
            }
            let complete_data = {
                confirmed: []
            }
            if (stage.data) {
                complete_data = {...stage.data}
            }
            
            complete_data.confirmed = complete_data.confirmed.filter(v => v !== user_id)
            
            let r = await update_db({
                model: "CommissionPhase",
                data: {_id: stage._id, data: complete_data},
                schema: commission_schema,
                validate: true,
            })

            await this.refresh()
            return r
        },

        async complete() {
            const user_id = this.state._current_user._id
            const stage = this.state.commission.stage
            if (stage.type !== "complete") {
                throw Error("Complete can only be done in the complete phase")
            }
            let complete_data = {
                confirmed: []
            }
            if (stage.data) {
                complete_data = {...stage.data}
            }
            
            complete_data.confirmed = [user_id, ...complete_data.confirmed].reduce(
                (unique, item) => unique.includes(item) ? unique :  [...unique, item], [])
            
            let r = await update_db({
                model: "CommissionPhase",
                data: {_id: stage._id, data: complete_data},
                schema: commission_schema,
                validate: true,
            })
            if (r.status) {
                let participants = [
                    this.state.commission.from_user._id,
                    this.state.commission.to_user._id,
                ]
                if (participants.every((v) => complete_data.confirmed.includes(v))) {
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
                ...this._end()
            })
            return r
        },

        _end(successfully?: boolean){
            return {
                finished: true,
                completed: successfully? true : false,
                end_date: new Date()
            }
        },
        async end(successfully?: boolean) {
            return await this.update(this._end(successfully))
        },

        async load(commission_id: string) {
            const phase_select = "user done done_date type title data"
            if (is_server()) {
                try {
                    const r = await Commission.findById(commission_id)
                        .populate("from_user")
                        .populate("to_user")
                        .populate("phases", phase_select)
                        .populate("stage", phase_select)
                    return r.toJSON()
                } catch (err) {
                    console.error(err)
                    return null
                }
            } else {
                return await fetch("/api/fetch",{
                    method:"post",
                    body: {model: "Commission",
                    method:"findById",
                    query: commission_id,
                    lean: false,
                    populate: ["from_user", "to_user", ["phases", phase_select], ["stage", phase_select]] }
                }).then(async r => {
                    if (r.ok) {
                        return (await r.json()).data
                    }
                    return null
                })
            }
        }

    },
)

export const useCommissionsStore = createStore(
    {
        commissions: undefined,
    },
    {
        sent_commissions(user_id) {
            return this.state.commissions.filter((d) => d.from_user._id === user_id)
        },
        received_commissions(user_id) {
            return this.state.commissions.filter((d) => d.to_user._id === user_id)
        },
        get_title(user_id, commission) {
            const owner = commission.from_user._id === user_id
            return owner ? commission.from_title : commission.to_title ? commission.to_title : commission.from_title
        }
    }
)

export const useCommissionRateStore = createStore(
  {
      rates: [],
      options: [],
  },
  {
    async create_rate(data, ...params) {
        let r = await update_db({
            model:'CommissionRate',
            data:data,
            schema:comission_rate_schema,
            create: true,
            validate: true,
            populate: ["extras", "user"],
            ...params})
        if (r.status) {
            this.setState({rates: iupdate(this.state.rates, {$push: [r.body.data]})})
        }
        return r
      },
    async create_option(data: object, ...params) {
        let r = await update_db({
            model:'CommissionExtraOption',
            data:data,
            schema:commission_extra_option_schema,
            create: true,
            validate: true,
            ...params})
        if (r.status) {
            this.setState({options: iupdate(this.state.options, {$push: [r.body.data]})})
        }
        return r
    },
    async get_rate(rate_id) {
        let r
        let rate_q = {_id:rate_id}

        if (is_server()) {

            r = CommissionRate.findOne(rate_q).populate("extras").populate("user", "username").lean()

        } else {

            r = await fetch("/api/fetch", {method:"post", body: {model: "CommissionRate", query: rate_q, method: "findOne"}}).then(async r => {
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
        let extra_option_q = {_id: {$in: ids}}

        if (is_server()) {

            r = CommissionExtraOption.find(extra_option_q).lean()

        } else {

            r = await fetch("/api/fetch", {method:"post", body: {model: "CommissionExtraOption", query: extra_option_q}}).then(async r => {
                    if (r.ok) {
                        return (await r.json()).data
                    } else {
                        return null
                    }
                })

        }
        return r
    },
    async load(profile_user) {

        let state = {
            options: [],
            rates: []
        }

        let a, b

        let extra_option_q = {user:profile_user._id}

        let rate_q = {user:profile_user._id}

        if (is_server()) {

            a = CommissionExtraOption.find(extra_option_q).lean().then((d) => {
                state.options = [...d]
            })

            b = CommissionRate.find(rate_q).populate("extras").populate("user", "username").lean().then((d) => {
                state.rates = [...d]
            })

        } else {

            a = await fetch("/api/fetch", {method:"post", body: {model: "CommissionExtraOption", query: extra_option_q}}).then(async r => {
                if (r.ok) {
                    state.options = [...(await r.json()).data]
                }
            })

            b = await fetch("/api/fetch", {method:"post", body: {model: "CommissionRate", query: rate_q, populate: [["user", "username"]]}}).then(async r => {
                if (r.ok) {
                    state.rates = [...(await r.json()).data]
                }
            })
            
        }

        await a
        await b
        
        return state
    }
  },
//   async (store) => {
//       await bootstrapStoreDev({useCommissionRateStore: store})
//   }
  );

