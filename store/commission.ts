import { defineStore, bootstrapStoreDev } from '@app/store'
import { update_db } from '@app/client/db'
import { comission_rate_schema, commission_extra_option_schema } from '@schema/commission'
import { iupdate, is_server } from '@utility/misc'
import { CommissionExtraOption, CommissionRate } from '@db/models';

export const useCommissionRateStore = defineStore(
  {
      rates: [],
      options: [],
  },
  {
    async create_rate(store, data, ...params) {
        let r = await update_db({
            model:'CommissionRate',
            data:data,
            schema:comission_rate_schema,
            create: true,
            validate: true,
            populate: ["extras", "user"],
            ...params})
        if (r.status) {
            store.setState({rates: iupdate(store.state.rates, {$push: [r.body.data]})})
        }
        return r
      },
    async create_option(store, data: object, ...params) {
        let r = await update_db({
            model:'CommissionExtraOption',
            data:data,
            schema:commission_extra_option_schema,
            create: true,
            validate: true,
            ...params})
        if (r.status) {
            store.setState({options: iupdate(store.state.options, {$push: [r.body.data]})})
        }
        return r
    },
    async load(store, user) {

        if (is_server()) {

            let a = CommissionExtraOption.find({user:user._id}).lean().then((d) => {
                store.setState({options: [...d]})
            })

            let b = CommissionRate.find({user:user._id}).populate("extras").populate("user", "username").lean().then((d) => {
                store.setState({rates: [...d]})
            })

            await a
            await b

            return store.state
        }

    }
  },
  async (store) => {
      await bootstrapStoreDev({useCommissionRateStore: store})
  }
  );

export default useCommissionRateStore;
