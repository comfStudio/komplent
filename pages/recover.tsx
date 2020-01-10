import React from 'react'
import { NextPageContext } from 'next'

import { InverseAuthPage } from '@components/App/AuthPage'
import MainLayout, { Container } from '@components/App/MainLayout'
import RecoverForm, { ResetPasswordForm } from '@components/Form/RecoverForm'
import { Props as AuthProps } from '@components/App/AuthPage'
import { is_server } from '@utility/misc'
import { jwt_verify } from '@server/misc'
import log from '@utility/log'


class Page extends InverseAuthPage<{ confirm_error: boolean, user_id: string } & AuthProps> {

    static async getInitialProps(ctx: NextPageContext) {

        const props = await super.getInitialProps(ctx)

        let confirm_error = true

        const recover_token = ctx.query.token

        if (is_server() && recover_token) {
            try {
                
                const data = jwt_verify(recover_token)
                
                if (data.type === 'recover') {
                    confirm_error = false
                }

            } catch (err) {
                log.warn(`Error occurred during recover page: ${err.message}`)
            }
        }

        return { ...props, confirm_error, recover_token }
    }

    render() {
        return this.renderPage(
            <MainLayout noSidebar activeKey="recover">
                <Container padded={16}>
                    {this.props.confirm_error && <RecoverForm panel />}
                    {!this.props.confirm_error && <ResetPasswordForm token={this.props.recover_token} panel />}
                </Container>
            </MainLayout>
        )
    }
}

export default Page
