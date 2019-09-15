import { useContext } from 'react'

import { useUserStore } from '@store/user'
import { ProfileContext } from '@client/context'

export const useUser = () => {
    const [user_store, user_actions] = useUserStore()
    return user_store.current_user
}

export const useProfileContext = () => {
    return useContext(ProfileContext)
}

export const useProfileUser = () => {
    const current_user = useUser()
    const { profile_user, ...context } = useProfileContext()
    const own_profile = current_user && profile_user && current_user._id == profile_user._id
    return {
        current_user,
        profile_user,
        context,
        own_profile
    }
}