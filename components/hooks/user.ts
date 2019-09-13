import { useUserStore } from '@store/user'

export const useUser = () => {
    const [user_store, user_actions] = useUserStore()
    return user_store.current_user
}