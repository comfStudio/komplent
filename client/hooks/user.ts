import { useContext, useState } from 'react'

import { useUserStore } from '@client/store/user'
import { ProfileContext } from '@client/context'
import { user_settings_schema } from '@schema/user';
import { useUpdateDatabase } from './db';

export const useUser = () => {
    const store = useUserStore()
    return store.state.current_user || {}
}

export const useProfileContext = () => {
    return useContext(ProfileContext)
}

export const useProfileUser = () => {
    const current_user = useUser()
    const { profile_user, ...context } = useProfileContext()
    return {
        current_user,
        profile_user,
        context,
    }
}