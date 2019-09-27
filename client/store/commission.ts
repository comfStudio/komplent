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
            return this.state.commission || {}
        },
        async create_commission(data, ...params) {
            let r = await update_db({
                model:'Commission',
                data:data,
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
                let rc = await this.load(this.state.commission._id)
                if (rc) {
                    this.setState({commission: rc})
                }
            }
            return r
        },

        async complete_phase(done=true) {
            let r = await update_db({
                model: "CommissionPhase",
                data: {_id: this.state.commission.stage._id, done, done_date: done? new Date() : null},
                schema: commission_schema,
                validate: true,
            })
            return r
        },

        async add_phase(type: 'pending_approval'|'pending_payment'|'pending_product'|'complete'|'cancel'|'reopen', {complete_previous_phase=true, done = false, params = {}} = {}) {
            if (complete_previous_phase) {
                this.complete_phase()
            }
            let r = await update_db({
                model: "CommissionPhase",
                data: {type, commission: this.state.commission._id, done, done_date: done ? new Date() : undefined, user: this.state._current_user._id},
                schema: commission_schema,
                validate: true,
                create: true,
                ...params
            })
            if (r.status) {
                let rc = await this.load(this.state.commission._id)
                if (rc) {
                    this.setState({commission: rc})
                }
            }
            return r
        },

        async accept() {
            let r = await this.update({
                accepted: true,
            })
            if (r.status) {
                r = await this.add_phase("pending_payment")
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
            return await this.update(this._end())
        },

        async load(commission_id: string) {
            const phase_select = "user done done_date type title"
            if (is_server()) {
                try {
                    return await Commission.findById(commission_id)
                        .populate("from_user")
                        .populate("to_user")
                        .populate("stage", phase_select)
                        .populate("phases", phase_select)
                        .lean()
                } catch (err) {
                    return null
                }
            } else {
                return await fetch("/api/fetch",{
                    method:"post",
                    body: {model: "Commission",
                    method:"findById",
                    query: commission_id,
                    populate: ["from_user", "to_user", ["stage", phase_select], ["phases", phase_select]] }
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
    async load(user) {

        let state = {
            options: [],
            rates: []
        }

        let a, b

        let extra_option_q = {user:user._id}

        let rate_q = {user:user._id}

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

