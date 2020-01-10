import React, { Component } from 'react'
import { NextPageContext } from 'next'

import MainLayout, { CenterPanel } from '@components/App/MainLayout'
import { is_server } from '@utility/misc'
import { jwt_verify } from '@server/misc'
import { t } from '@app/utility/lang'
import { verify_user_email } from '@services/user'
import log from '@utility/log'

enum ConfirmType {
    invalid,
    activated_email,
    error,
}

class DashboardPage extends Component<{ type: ConfirmType }> {
    static async getInitialProps(ctx: NextPageContext) {

        let type = ConfirmType.error

        const token = ctx.query.token

        if (is_server() && token) {
            try {
                
                const data = jwt_verify(token)

                switch (data.type) {

                    case 'email': {
                        if (await verify_user_email(data.user_id, data.email, true)) {
                            type = ConfirmType.activated_email
                        }
                        break
                    }

                    default:
                        break
                }

            } catch (err) {
                log.warn(`Error occurred during confirm page: ${err.message}`)
            }
        }

        return { type }
    }

    render() {

        let txt = ""

        switch (this.props.type) {
            case ConfirmType.activated_email:
                txt = t`Your email address has now been confirmed.`
                break
            case ConfirmType.error:
            case ConfirmType.invalid:
            default:
                txt = t`This token is invalid or has expired.`
                break
        }

        return (
            <MainLayout>
                <CenterPanel subtitle={txt}></CenterPanel>
            </MainLayout>
        )
    }
}

export default DashboardPage
