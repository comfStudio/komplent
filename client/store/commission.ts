import { createStore, bootstrapStoreDev } from '@client/store'
import { update_db } from '@app/client/db'
import { comission_rate_schema, commission_extra_option_schema, commission_schema } from '@schema/commission'
import { iupdate, is_server } from '@utility/misc'
import { CommissionExtraOption, CommissionRate } from '@db/models';
import { fetch } from '@utility/request';

export const useCommissionStore = createStore(
    {
        commission: undefined,
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

