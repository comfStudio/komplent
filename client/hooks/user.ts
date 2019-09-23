import { useContext, useState } from 'react'

import { useUserStore } from '@store/user'
import { ProfileContext } from '@client/context'
import { user_settings_schema } from '@schema/user';
import { useUpdateDatabase } from './db';

export const useUser = () => {
    const [user_store, user_actions] = useUserStore()
    return user_store.current_user || {}
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

export const useSettings = () => {
    const current_user = useUser()
    
    let isettings = null

    if (current_user) {
        isettings = current_user.settings
    }

    const [settings, set_settings] = useState(isettings)
    const update = useUpdateDatabase(null, user_settings_schema, true)

    const update_settings = async (s) => {
        let r = await update("UserSettings", s)
        if (r.status) {
            set_settings(s)
        }

    }

    return [settings, update_settings]
}