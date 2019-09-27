import React, { Component, useEffect } from 'react';
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

export interface Props {
    useUserState?: object
    useGlobalAppState?: object
    inverse?: boolean
    requested_page?: string
}

interface AsLoginProps {
    requested_page: string
}

const AsLoginPage = (props: AsLoginProps) => {

    useEffect(() => {
        Router.replace(props.requested_page, pages.login, { shallow: true });
    }, [])

    return (
        <LoginPage/>
    )
}

export class AuthPage<T extends Props = Props> extends Component<T> {

    static async getInitialProps (ctx: NextPageContext) {

        let c = cookies.get(ctx)
        let current_user = await fetch_user(c)

        let active_commissions_count = 0
        let active_requests_count = 0

        let user_store = {user: null, has_selected_usertype: false}
        if (current_user && is_server()) {
            let r = await UserStore.findOne({user:Types.ObjectId(current_user._id)}).lean()
            if (r) {
                user_store = r
                delete user_store.user
            }

            let comms = await Commission.find_related(current_user._id, {only_active: true})
            for (let c of comms) {
                if (c.accepted) {
                    active_commissions_count += 1
                } else {
                    active_requests_count += 1
                }
            }

        }

        
        let useUserState = useUserStore.createState({
            current_user,
            logged_in: !!current_user,
            active_commissions_count,
            active_requests_count,
            ...user_store
        })
        
        let requested_page = ctx.asPath

        return { useUserState, inverse: false, requested_page }
      }

    renderPage(children) {

        const logged_in = this.props.useUserState.logged_in

        if ((logged_in && !this.props.inverse) || (!logged_in && this.props.inverse)) {
            return (
                <useUserStore.Provider initialState={this.props.useUserState}>
                    {children}
                </useUserStore.Provider>
                )
        } else {
            return (
                <useUserStore.Provider initialState={this.props.useUserState}>
                    <LoginContext.Provider value={{next_page:this.props.requested_page}}>
                        <AsLoginPage requested_page={this.props.requested_page}/>
                    </LoginContext.Provider>
                </useUserStore.Provider>
            )
        }

    }
}

export class InverseAuthPage<T = Props> extends AuthPage<T> {

    static async getInitialProps (ctx: NextPageContext) {

        let {inverse, ...props} = await super.getInitialProps(ctx)
        inverse = true
        return {...props, inverse}

      }
}

export class OptionalAuthPage<T = Props> extends AuthPage<T> {

    renderPage(children) {
        return children
    }

}

export default AuthPage;