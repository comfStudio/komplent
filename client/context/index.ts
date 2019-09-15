import React from 'react'

interface Profile {
    profile_id: string
    profile_user: object
    profile_path: string
}

export const ProfileContext = React.createContext<Profile>(null)