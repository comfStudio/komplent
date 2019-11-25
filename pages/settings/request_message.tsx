import React from 'react'
import { NextPageContext } from 'next'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import SettingsLayout from '@components/Settings'
import { RequireCreator } from '@components/Profile'
import { RequestMessage } from '@components/Settings/CommissionMessage'
import { fetch_database_text } from '@server/misc'

interface Props extends AuthProps {}

class CommissionSettingsPage extends AuthPage<Props> {
    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        const key = 'commission_request_message'
        if (props.useUserState.current_user) {
            props.useUserState.current_user[key] = await fetch_database_text(
                props.useUserState.current_user[key]
            )
        }

        return {
            ...props,
        }
    }

    public render() {
        return this.renderPage(
            <SettingsLayout activeKey="request_message">
                <RequireCreator />
                <RequestMessage />
            </SettingsLayout>
        )
    }
}

export default CommissionSettingsPage
