import qs from 'qs'
import cookies from 'nookies'
import { OK } from 'http-status-codes';

import Router from 'next/router'
import { defineStore, bootstrapStoreDev } from '@app/store'
import * as pages from '@utility/pages'
import { fetch } from '@utility/request'
import { is_server } from '@utility/misc'
import { COOKIE_AUTH_TOKEN_KEY } from '@server/constants'
import { get_jwt_data, get_jwt_user } from '@server/middleware'
import { update_db } from '@app/client/db'
import { store_schema } from '@schema/user'

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

interface UserStoreState {
    current_user: object,
    logged_in: boolean,
    has_selected_usertype: boolean
}

interface UserStoreActions {
    login(data: any, redirect?: boolean)
    logout(redirect?: boolean)
    exists(name: string)
    join(data: any, redirect?: boolean)
    save()
}

export const useUserStore = defineStore(
  {
      current_user: undefined,
      logged_in: undefined,
      has_selected_usertype: undefined,
  } as UserStoreState,
  {
    login: async (store, data, redirect: boolean | string = false) => {
    let r = await fetch("/api/login", {
        method: "post",
        json: true,
        body: data,
    })

        if (r.status == OK) {
        let data = await r.json()
        store.setState({current_user: data.user, logged_in: true})

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
    logout: async (store, redirect = true) => {
    let r = await fetch("/api/logout", {
        method: "get",
    })

        if (r.status == OK) {

        if (!is_server()) {
            cookies.destroy({}, COOKIE_AUTH_TOKEN_KEY)
        }

        store.setState({current_user: null, logged_in: false})

        if (redirect) {
            Router.replace(pages.home)
        }
        return [true, null]
    }

    return [false, (await r.json()).error]
    },
    exists: async (store, name) => {
    const r = await fetch(`/api/user?${qs.stringify({username:name, email:name})}`, {
        method: "get",
    })
    if (r.status == OK) {
        return true
    }
    return false
    },
    join: async (store, data, redirect = false) => {
    let r = await fetch("/api/join", {
        method: "post",
        json: true,
        body: data,
    })

    if (r.status == OK) {
        await store.actions.login({name:data.email, password:data.password}, redirect)

        return [true, null]
    }

    return [false, (await r.json()).error]
    },
    save: async (store) => {
        let state = {...store.state, user: store.state.current_user._id}
        delete state.current_user
        return await update_db({model:'UserStore', data:state, schema:store_schema, validate:true, create:true})
    }
  },
  async (store) => {
    await bootstrapStoreDev({useUserStore: store})
  }
);

export default useUserStore;
