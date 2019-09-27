import qs from 'qs'
import cookies from 'nookies'
import { OK } from 'http-status-codes';

import Router from 'next/router'
import { createStore, bootstrapStoreDev } from '@client/store'
import * as pages from '@utility/pages'
import { fetch } from '@utility/request'
import { is_server } from '@utility/misc'
import { COOKIE_AUTH_TOKEN_KEY } from '@server/constants'
import { get_jwt_data, get_jwt_user } from '@server/middleware'
import { update_db } from '@app/client/db'
import { user_store_schema } from '@schema/user'

export const fetch_user = async (cookies) => {
    if (cookies[COOKIE_AUTH_TOKEN_KEY]) {
        
        if (is_server()) {
            return await get_jwt_user(get_jwt_data(cookies[COOKIE_AUTH_TOKEN_KEY]))
        } else {
            let r = await fetch('/api/user')
            if (r.status == OK) {
                return (await r.json()).user
            }
        }

    }
}


export const useUserStore = createStore(
  {
      _id: undefined as string,
      current_user: undefined as any,
      logged_in: undefined as boolean,
      has_selected_usertype: true,
      active_commissions_count: 0,
      active_requests_count: 0,
  },
  {
    async login(data, redirect: boolean | string = false) {
    let r = await fetch("/api/login", {
        method: "post",
        json: true,
        body: data,
    })

        if (r.status == OK) {
        let data = await r.json()
        this.setState({current_user: data.user, logged_in: true})

        if (!is_server()) {
            cookies.set({},COOKIE_AUTH_TOKEN_KEY, data.token, {
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day
            })
        }

        if (redirect) {
            Router.replace(typeof redirect === 'string'? redirect : pages.dashboard)
        }
        return [true, null]
    }

    return [false, (await r.json()).error]
    },
    async logout(redirect = true) {
    let r = await fetch("/api/logout", {
        method: "get",
    })

        if (r.status == OK) {

        if (!is_server()) {
            cookies.destroy({}, COOKIE_AUTH_TOKEN_KEY)
        }

        this.setState({current_user: null, logged_in: false})

        if (redirect) {
            Router.replace(pages.home)
        }
        return [true, null]
    }

    return [false, (await r.json()).error]
    },
    async exists(name) {
    const r = await fetch(`/api/user?${qs.stringify({username:name, email:name})}`, {
        method: "get",
    })
    if (r.status == OK) {
        return true
    }
    return false
    },
    async join(data, redirect = false) {
    let r = await fetch("/api/join", {
        method: "post",
        json: true,
        body: data,
    })

    if (r.status == OK) {
        await this.actions.login({name:data.email, password:data.password}, redirect)

        return [true, null]
    }

    return [false, (await r.json()).error]
    },
    async save(state?: object) {
        let s = {_id: this.state._id, has_selected_usertype: this.state.has_selected_usertype, user: this.state.current_user._id, ...state}
        return await update_db({model:'UserStore', data:s, schema:user_store_schema, validate:true, create:true})
    }
  },
//   async (store) => {
//     await bootstrapStoreDev({useUserStore: store})
//   }
);

export default useUserStore;
