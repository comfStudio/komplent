import fetch from 'isomorphic-unfetch'
import { defineStore } from '@app/store'

export const useUserStore = defineStore(
  {
      current_user: null
  },
  {
      login: (store, data, redirect = false) => {
          fetch("/api/login", {
              credentials: "include",
              method: redirect ? "get" : "post",
              body: JSON.stringify(data),
          }).then(r => console.log(r))
      }
  }
  );

export default useUserStore;
