import React from 'react';
import { NextPageContext } from 'next'
import { NOT_FOUND } from 'http-status-codes';
import Error from 'next/error'

import { OptionalAuthPage, Props as AuthProps } from '@components/App/AuthPage'
import { ProfileContext } from '@client/context'
import { get_profile_id, get_profile_urlpart } from '@utility/pages'
import { User } from '@db/models'
import { IUser } from '@schema/user'


interface Props extends AuthProps {
    error: number | null
    profile_id: string
    profile_user: IUser
    profile_path: string
}

class ProfilePage extends OptionalAuthPage<Props> {
    static async getInitialProps(ctx: NextPageContext) {
        let profile_id = get_profile_id(ctx.asPath)
        let error = null
        let profile_user = null
        let profile_path = ""
        
        if (profile_id) {
            profile_user = await User.findOne({username: profile_id}).lean()
            profile_path = `/${get_profile_urlpart(ctx.asPath)}`
        }

        if (!profile_user) {
            error = NOT_FOUND
            ctx.res.statusCode = error
        }

        const props = await super.getInitialProps(ctx)

        return {
            error,
            profile_id,
            profile_user,
            profile_path,
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
            }}>
                {super.renderPage(children)}
            </ProfileContext.Provider>
        )
    }
}

export default ProfilePage;