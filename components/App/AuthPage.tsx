import React, { Component } from 'react';
import { NextPageContext } from 'next'
import cookies from 'nookies'

import Auth from '@components/User/Auth'
import { initializeStore } from '@app/store'
import { UserStore } from '@db/models'
import useUserStore, { fetch_user } from '@store/user'

export interface Props {
    useUserState?: object
    inverse?: boolean
}

export class AuthPage<T extends Props = Props> extends Component<T> {

    constructor(props) {
        super(props)
        initializeStore(useUserStore, props.useUserState)
    }

    static async getInitialProps (ctx: NextPageContext) {

        let c = cookies.get(ctx)
        let current_user = await fetch_user(c)

        let user_store = {}
        if (current_user) {
            let r = await UserStore.findOne({user:current_user._id}).lean()
            if (r) {
                user_store = r
                delete user_store.user
            }
        }

        let useUserState = {
            current_user,
            logged_in: !!current_user,
            has_selected_usertype: false,
            ...user_store
        }

        return { useUserState, inverse: false }
      }

    renderPage(children) {
        return (
            <Auth inverse={this.props.inverse}>
                {children}
            </Auth>
        )
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