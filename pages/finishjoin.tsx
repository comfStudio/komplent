import React from 'react'
import qs from 'qs'
import Router from 'next/router'

import { MainLayout, Container } from '@components/App/MainLayout'
import { FinishJoinForm } from '@components/Form/JoinForm'
import { OptionalAuthPage, Props } from '@components/App/AuthPage'
import { NextPageContext } from 'next'
import { is_server } from '@utility/misc'
import { User } from '@db/models'
import { fetch } from '@utility/request'
import { ErrorPageType } from '@server/constants'
import * as pages from '@utility/pages'

interface PageProps extends Props {
    error: ErrorPageType
}

class FinishJoinPage extends OptionalAuthPage<PageProps> {

    static async getInitialProps(ctx: NextPageContext) {
        const props = await super.getInitialProps(ctx)

        let useUserState = { ...props.useUserState }
        let error
        let ok = false

        if (!useUserState?.logged_in) {
            if (ctx.query.user_id) {
                if (is_server()) {
                    useUserState.current_user = await User.findById(ctx.query.user_id).populate("avatar").lean()
                } else {
                    await fetch('/api/fetch', {
                        method: 'post',
                        body: {
                            model: 'User',
                            method: 'findById',
                            query: ctx.query.user_id,
                        },
                    }).then(async r => {
                        if (r.ok) {
                            useUserState.current_user = (await r.json()).data
                        }
                    })
                }
    
                for (let v of useUserState.current_user.oauth_data) {
                    if (v.provider === ctx.query.provider && v.accessToken === ctx.query.token) {
                        ok = true
                    }
                }
            }
        } else {
            ok = true
        }

        if (!ok) {
            error = ErrorPageType.Generic
        }

        return { ...props, useUserState, error }
    }

    constructor(props) {
        super(props)
        
        if (!is_server()) {
            if (props.error != undefined) {
                Router.replace(pages.error + '?' + qs.stringify({type: this.props.error}))
            }
        }
    }

    render() {
        return this.renderPage(
            <MainLayout activeKey="finishjoin">
                <Container padded={16}>
                    <FinishJoinForm panel />
                </Container>
            </MainLayout>
        )
    }
}

export default FinishJoinPage
