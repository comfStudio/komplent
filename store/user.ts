import fetch from 'isomorphic-unfetch'
import { defineStore } from '@app/store'
import qs from 'qs'

export const useUserStore = defineStore(
  {
      current_user: null
  },
  {
      login: async (store, data, redirect = false) => {
          return await fetch("/api/login", {
              credentials: "include",
              method: redirect ? "get" : "post",
              body: JSON.stringify(data),
          })
      },
      exists: async (store, name) => {
        const r = await fetch(`/api/user?${qs.stringify({username:name, email:name})}`, {
            credentials: "include",
            method: "get",
        })
        if (r.status == 200) {
            return true
        }
        return false
      },
      join: async (store, data, redirect = false) => {
        return await fetch("/api/join", {
            credentials: "include",
            method: redirect ? "get" : "post",
            body: JSON.stringify(data),
        })
    }
  }
  );

export default useUserStore;
