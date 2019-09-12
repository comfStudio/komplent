import React, { Component } from 'react';
import { NextPageContext } from 'next'
import Router from 'next/router'
import cookies from 'nookies'

import * as pages from '@utility/pages'
import Auth from '@components/User/Auth'
import { initializeStore } from '@app/store'
import useUserStore, { fetch_user } from '@store/user'

interface Props {
    useUserState?: object
    inverse?: boolean
}

export class AuthPage extends Component<Props> {

    static async getInitialProps (ctx: NextPageContext) {

        let c = cookies.get(ctx)
        let current_user = await fetch_user(c)
        let useUserState = {
            current_user,
            logged_in: !!current_user,
        }

        return { useUserState, inverse: false }
      }

    static getDerivedStateFromProps(props, state) {
        initializeStore(useUserStore, props.useUserState)
        return null
    }

    renderPage(children) {
        return (
            <Auth inverse={this.props.inverse}>
                {children}
            </Auth>
        )
    }
}

export class InverseAuthPage extends AuthPage {

    static async getInitialProps (ctx: NextPageContext) {

        let {inverse, ...props} = await super.getInitialProps(ctx)
        inverse = true
        return {...props, inverse}

      }
}

export default AuthPage;