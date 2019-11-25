import { useUserStore } from '@client/store/user'

export const useLoginStatus = () => {
    const store = useUserStore()
    return store.state.logged_in
}
