import React from 'react'

interface Profile {
    profile_id?: string
    profile_user?: object
    profile_path?: string
    profile_owner?: boolean
    commissions_open?: boolean
    follow?: any
}

export const ProfileContext = React.createContext<Profile>({})

interface Login {
    next_page?: string | boolean
}

export const LoginContext = React.createContext<Login>({})
