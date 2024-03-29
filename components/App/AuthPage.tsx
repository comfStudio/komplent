import React, { useEffect, memo } from 'react'
import { NextPageContext } from 'next'
import cookies from 'nookies'
import Router from 'next/router'
import { Types } from 'mongoose'

import { UserStore, Commission } from '@db/models'
import useUserStore, { fetch_user } from '@client/store/user'
import { is_server } from '@utility/misc'
import { LoginContext } from '@client/context'
import * as pages from '@utility/pages'
import LoginPage from '@components/App/LoginPage'
import { fetch } from '@utility/request'
import { NoLoginPage } from '@components/User/Auth'
import { Page } from '@components/App/Page'

export interface Props {
    useUserState?: object
    useGlobalAppState?: object
    inverse?: boolean
    optional?: boolean
    requested_page?: string
}

interface AsLoginProps {
    requested_page: string
}

const AsLoginPage = memo(function AsLoginPage (props: AsLoginProps) {
    return <LoginPage />
})

export class AuthPage<T extends Props = Props> extends Page<T> {
    static async getInitialProps(ctx: NextPageContext) {
        let c = cookies.get(ctx)
        let current_user = await fetch_user(c)

        let active_commissions_count = 0
        let active_requests_count = 0

        let user_store = { user: null, has_selected_usertype: false }
        if (current_user) {
            let u_store
            if (is_server()) {
                u_store = await UserStore.findOne({
                    user: Types.ObjectId(current_user._id),
                }).lean()
            } else {
                await fetch('/api/fetch', {
                    method: 'post',
                    body: {
                        model: 'UserStore',
                        method: 'findOne',
                        query: { user: current_user._id },
                    },
                }).then(async r => {
                    if (r.ok) {
                        u_store = (await r.json()).data
                    }
                })
            }

            active_commissions_count += await useUserStore.actions.get_commissions_count(
                { to_user: current_user._id, finished: false, accepted: true }
            )
            active_commissions_count += await useUserStore.actions.get_commissions_count(
                { from_user: current_user._id, finished: false, accepted: true }
            )
            active_requests_count += await useUserStore.actions.get_commissions_count(
                { to_user: current_user._id, finished: false, accepted: false }
            )
            active_requests_count += await useUserStore.actions.get_commissions_count(
                {
                    from_user: current_user._id,
                    finished: false,
                    accepted: false,
                }
            )

            if (u_store) {
                user_store = u_store
                delete user_store.user
            }
        }

        let useUserState = useUserStore.createState({
            current_user,
            logged_in: !!current_user,
            is_creator: current_user?.type === 'creator',
            active_commissions_count,
            active_requests_count,
            ...user_store,
        })

        let requested_page = ctx.asPath

        return { useUserState, inverse: false, optional: false, requested_page }
    }

    renderPage(children) {
        const without_login_context = (
            <useUserStore.Provider initialState={this.props.useUserState}>
                {children}
            </useUserStore.Provider>
        )

        if (this.props.optional) {
            return without_login_context
        }

        const logged_in = this.props.useUserState.logged_in

        if (
            (logged_in && !this.props.inverse) ||
            (!logged_in && this.props.inverse)
        ) {
            return without_login_context
        } else if (logged_in && this.props.inverse) {
            return (
                <useUserStore.Provider initialState={this.props.useUserState}>
                    <NoLoginPage />
                </useUserStore.Provider>
            )
        } else {
            return (
                <useUserStore.Provider initialState={this.props.useUserState}>
                    <LoginContext.Provider
                        value={{ next_page: this.props.requested_page }}>
                        <AsLoginPage
                            requested_page={this.props.requested_page}
                        />
                    </LoginContext.Provider>
                </useUserStore.Provider>
            )
        }
    }
}

export class InverseAuthPage<T = Props> extends AuthPage<T> {
    static async getInitialProps(ctx: NextPageContext) {
        let { inverse, ...props } = await super.getInitialProps(ctx)
        inverse = true
        return { ...props, inverse }
    }
}

export class OptionalAuthPage<T = Props> extends AuthPage<T> {
    static async getInitialProps(ctx: NextPageContext) {
        let { optional, ...props } = await super.getInitialProps(ctx)
        optional = true
        return { ...props, optional }
    }
}

export default AuthPage
