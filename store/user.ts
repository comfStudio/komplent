import qs from 'qs'
import { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes'
import cookies from 'nookies'

import Router from 'next/router'
import { defineStore } from '@app/store'
import * as pages from '@utility/pages'
import { fetch } from '@utility/request'
import { is_server } from '@utility/misc'
import { COOKIE_AUTH_TOKEN_KEY } from '@server/constants'
import { get_jwt_data, get_jwt_user } from '@server/middleware'

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

export const useUserStore = defineStore(
  {
      current_user: undefined,
      logged_in: undefined
  },
  {
      login: async (store, data, redirect = false) => {
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
                    maxAge: 60 * 60 * 24 // 1 day
                })
            }

            if (redirect) {
                Router.replace(pages.dashboard)
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
                cookies.destroy({},COOKIE_AUTH_TOKEN_KEY, {
                    maxAge: 60 * 60 * 24 // 1 day
                })
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
    }
  },
  async (store) => {
    if (!is_server()) {
        if (store.state.current_user === undefined) {
            let c = cookies.get()
            let u = await fetch_user(c)
            store.setState({
                current_user: u,
                logged_in: !!u
            })
        }
    }
  }
);

export default useUserStore;
