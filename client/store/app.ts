import { defineGlobalStore, bootstrapStoreDev } from '@client/store'

export const useGlobalAppStore = defineGlobalStore (
  {
  },
  {},
  async (store) => {
    await bootstrapStoreDev({useGlobalAppStore: store})
  }
  );

export default useGlobalAppStore;
