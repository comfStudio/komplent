import fetch from 'isomorphic-unfetch'
import { defineStore } from '@app/store'

export const useUserStore = defineStore(
  {
      current_user: null
  },
  {
      login: (store, data) => {
          console.log(`logging in ${data}`)
      }
  }
  );

export default useUserStore;
