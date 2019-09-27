import React from 'react';
import { NextPageContext } from 'next'
import { NOT_FOUND } from 'http-status-codes';
import Error from 'next/error'

import { OptionalAuthPage, Props as AuthProps } from '@components/App/AuthPage'
import { ProfileContext } from '@client/context'
import { get_profile_id, make_profile_path } from '@utility/pages'
import { User } from '@db/models'
import { IUser } from '@schema/user'
import { is_server } from '@utility/misc';
import { useCommissionRateStore } from '@client/store/commission';
import { fetch } from '@utility/request';


interface Props extends AuthProps {
    error: number | null
    profile_id: string
    profile_user: IUser
    profile_path: string
    profile_owner: boolean
    commissionRateStoreState: object
}

class ProfilePage extends OptionalAuthPage<Props> {

    static async getInitialProps(ctx: NextPageContext) {
        let profile_id = get_profile_id(ctx.asPath)
        let error = null
        let profile_user = null
        let profile_path = ""
        
        if (profile_id) {
            let q = {username: profile_id, type:"creator"}
            if (is_server()) {
                profile_user = await User.findOne(q).lean()
            } else {
                await fetch("/api/fetch", {method:"post", body: {model: "User", method:"findOne", query: q}}).then(async r => {
                    if (r.ok) {
                        profile_user = (await r.json()).data
                    }
                })
            }

            if (profile_user) {
                profile_path = make_profile_path(profile_user)
            }
            
        }
        
        if (!profile_user) {
            error = NOT_FOUND
            ctx.res.statusCode = error
        }
        
        const props = await super.getInitialProps(ctx)

        console.log(props.useUserState)

        const profile_owner = props.useUserState.current_user && profile_user && props.useUserState.current_user.username == profile_user.username

        let commissionRateStoreState = useCommissionRateStore.createState({})
        if (profile_user) {
            commissionRateStoreState = await useCommissionRateStore.actions.load(profile_user)
        }
        
        return {
            error,
            profile_id,
            profile_user,
            profile_path,
            profile_owner,
            commissionRateStoreState,
            ...props
        }
    }

    renderPage(children) {

        if (this.props.error) {
            return <Error statusCode={this.props.error}/>
        }

        return (
            <useCommissionRateStore.Provider initialState={this.props.commissionRateStoreState}>
                <ProfileContext.Provider value={{
                    profile_id: this.props.profile_id,
                    profile_user: this.props.profile_user,
                    profile_path: this.props.profile_path,
                    profile_owner: this.props.profile_owner,
                }}>
                    {super.renderPage(children)}
                </ProfileContext.Provider>
            </useCommissionRateStore.Provider>
        )
    }
}

export default ProfilePage;