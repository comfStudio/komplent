import React from 'react';
import { NextPageContext } from 'next'
import { NOT_FOUND } from 'http-status-codes';
import Error from 'next/error'

import { OptionalAuthPage, Props as AuthProps } from '@components/App/AuthPage'
import { ProfileContext } from '@client/context'
import { get_profile_id, make_profile_path } from '@utility/pages'
import { User } from '@db/models'
import { IUser } from '@schema/user'


interface Props extends AuthProps {
    error: number | null
    profile_id: string
    profile_user: IUser
    profile_path: string
    profile_owner: boolean
}

class ProfilePage extends OptionalAuthPage<Props> {
    static async getInitialProps(ctx: NextPageContext) {
        let profile_id = get_profile_id(ctx.asPath)
        let error = null
        let profile_user = null
        let profile_path = ""
        
        if (profile_id) {
            profile_user = await User.findOne({username: profile_id, type:"creator"}).lean()

            if (profile_user) {
                profile_path = make_profile_path(profile_user)
            }
            
        }
        
        if (!profile_user) {
            error = NOT_FOUND
            ctx.res.statusCode = error
        }
        
        const props = await super.getInitialProps(ctx)

        const profile_owner = props.useUserState.current_user && profile_user && props.useUserState.current_user.username == profile_user.username

        return {
            error,
            profile_id,
            profile_user,
            profile_path,
            profile_owner,
            ...props
        }
    }

    renderPage(children) {

        if (this.props.error) {
            return <Error statusCode={this.props.error}/>
        }

        return (
            <ProfileContext.Provider value={{
                profile_id: this.props.profile_id,
                profile_user: this.props.profile_user,
                profile_path: this.props.profile_path,
                profile_owner: this.props.profile_owner,
            }}>
                {super.renderPage(children)}
            </ProfileContext.Provider>
        )
    }
}

export default ProfilePage;