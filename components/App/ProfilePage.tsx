import React from 'react'
import { NextPageContext } from 'next'
import { NOT_FOUND } from 'http-status-codes'
import Error from 'next/error'

import { OptionalAuthPage, Props as AuthProps } from '@components/App/AuthPage'
import { ProfileContext } from '@client/context'
import { parse_profile_id, make_profile_urlpath } from '@utility/pages'
import { User } from '@db/models'
import { IUser } from '@schema/user'
import { is_server } from '@utility/misc'
import { useCommissionRateStore } from '@client/store/commission'
import { fetch } from '@utility/request'
import useUserStore from '@store/user'

interface Props extends AuthProps {
    error: number | null
    profile_id: string
    profile_user: IUser
    profile_path: string
    profile_owner: boolean
    slots_left: number
    requests_count: number
    follow: any
    commissionRateStoreState: object
}

class ProfilePage extends OptionalAuthPage<Props> {

    static populate_license = false

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)
        let profile_id = parse_profile_id(ctx.asPath)
        let error = null
        let profile_user = null
        let profile_path = ''
        let slots_left = 0
        let requests_count = 0

        if (profile_id) {
            let q = {
                username: profile_id,
                type: 'creator',
                $or: [{ visibility: 'public' }, { visibility: 'private' }],
            }
            if (
                props.useUserState &&
                props.useUserState.current_user &&
                profile_id === props.useUserState.current_user.username
            ) {
                q['$or'].push({ visibility: 'hidden' })
            }
            let p = ['tags', 'profile_cover', 'avatar']
            if (is_server()) {
                profile_user = await User.findOne(q)
                    .populate(p[0])
                    .populate(p[1])
                    .populate(p[2])
                    .lean()
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'User',
                        method: 'findOne',
                        query: q,
                        populate: p,
                    },
                }).then(async r => {
                    if (r.ok) {
                        profile_user = (await r.json()).data
                    }
                })
            }

            if (profile_user) {
                profile_path = make_profile_urlpath(profile_user)
                slots_left = profile_user.ongoing_commissions_limit ?? 0
                slots_left -= await useUserStore.actions.get_commissions_count({
                    to_user: profile_user._id,
                    finished: false,
                    accepted: true,
                })
                requests_count += await useUserStore.actions.get_commissions_count(
                    {
                        to_user: profile_user._id,
                        finished: false,
                        accepted: false,
                    }
                )
            }
        }

        if (!profile_user) {
            error = NOT_FOUND
            ctx.res.statusCode = error
        }

        const profile_owner =
            props.useUserState.current_user &&
            profile_user &&
            props.useUserState.current_user._id == profile_user._id

        let commissionRateStoreState = useCommissionRateStore.createState({})
        if (profile_user) {
            commissionRateStoreState = await useCommissionRateStore.actions.load(
                profile_user, {licenses: false, populate_license: this.populate_license }
            )
        }

        let follow = null
        if (props.useUserState.current_user) {
            follow = await useUserStore.actions.get_follow(
                profile_user,
                props.useUserState.current_user
            )
        }

        return {
            error,
            profile_id,
            profile_user,
            profile_path,
            profile_owner,
            slots_left,
            requests_count,
            commissionRateStoreState,
            follow,
            ...props,
        }
    }

    renderPage(children) {
        if (this.props.error) {
            return <Error statusCode={this.props.error} />
        }

        return (
            <useCommissionRateStore.Provider
                initialState={this.props.commissionRateStoreState}>
                <ProfileContext.Provider
                    value={{
                        profile_id: this.props.profile_id,
                        profile_user: this.props.profile_user,
                        profile_path: this.props.profile_path,
                        profile_owner: this.props.profile_owner,
                        commissions_open: this.props.profile_user
                            .commissions_open,
                        slots_left: this.props.slots_left,
                        requests_count: this.props.requests_count,
                        follow: this.props.follow,
                    }}>
                    {super.renderPage(children)}
                </ProfileContext.Provider>
            </useCommissionRateStore.Provider>
        )
    }
}

export default ProfilePage
