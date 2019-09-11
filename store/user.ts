import qs from 'qs'
import fetch from 'isomorphic-unfetch'
import { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes'

import Router from 'next/router'
import { defineStore } from '@app/store'
import * as pages from '@utility/pages'


export const useUserStore = defineStore(
  {
      current_user: null
  },
  {
      login: async (store, data, redirect = false) => {
          return await fetch("/api/login", {
              credentials: "include",
              method: redirect ? "get" : "post",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data),
          })
      },
      exists: async (store, name) => {
        const r = await fetch(`/api/user?${qs.stringify({username:name, email:name})}`, {
            credentials: "include",
            method: "get",
        })
        if (r.status == OK) {
            return true
        }
        return false
      },
      join: async (store, data, redirect = false) => {
        let r = await fetch("/api/join", {
            credentials: "include",
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data),
        })

        if (r.status == OK) {
            if (redirect) {
                Router.push(pages.dashboard)
            }
            return [true, null]
        }

        return [false, (await r.json()).error]
    }
  }
  );

export default useUserStore;
