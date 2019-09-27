import { createStore, bootstrapStoreDev } from '@client/store'
import { update_db } from '@app/client/db'
import { comission_rate_schema, commission_extra_option_schema, commission_schema } from '@schema/commission'
import { iupdate, is_server } from '@utility/misc'
import { CommissionExtraOption, CommissionRate } from '@db/models';

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

        if (is_server()) {

            let state = {
                options: [],
                rates: []
            }

            let a = CommissionExtraOption.find({user:user._id}).lean().then((d) => {
                state.options = [...d]
            })

            let b = CommissionRate.find({user:user._id}).populate("extras").populate("user", "username").lean().then((d) => {
                state.rates = [...d]
            })

            await a
            await b

            return state
        }

    }
  },
//   async (store) => {
//       await bootstrapStoreDev({useCommissionRateStore: store})
//   }
  );

