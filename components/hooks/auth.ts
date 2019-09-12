import { useUserStore } from '@store/user'

export const useLoginStatus = () => {
    const [user_store, user_actions] = useUserStore()
    return user_store.logged_in
}