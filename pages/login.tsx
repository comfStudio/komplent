import React from 'react'

import { InverseAuthPage } from '@components/App/AuthPage'
import LoginPage from '@components/App/LoginPage'
import { LoginContext } from '@client/context'
import Router from 'next/router'
import useUserStore from '@store/user'
import { is_server } from '@utility/misc'

class Page extends InverseAuthPage {

    constructor(props) {
        super(props)

        if (!is_server() && Router.query.token) {
            useUserStore.actions.update_user_token(Router.query.token, Router.query.next || true)
        }
    }

    render() {
        return this.renderPage(
            <LoginContext.Provider value={{ next_page: true }}>
                <LoginPage />
            </LoginContext.Provider>
        )
    }
}

export default Page
