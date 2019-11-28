import React from 'react'

interface Profile {
    profile_id?: string
    profile_user?: object
    profile_path?: string
    profile_owner?: boolean
    commissions_open?: boolean
    slots_left?: number
    requests_count?: number
    follow?: any
}

export const ProfileContext = React.createContext<Profile>({})
export const NoProfileContext = (props: any) => { return React.createElement(ProfileContext.Provider, {value: {}}, props.children) }

interface Login {
    next_page?: string | boolean
}

export const LoginContext = React.createContext<Login>({})
