import React from 'react'

import MainLayout, { CenterPanel } from '@components/App/MainLayout'
import { t } from '@app/utility/lang'
import { useRouter } from 'next/router'
import { MsgPageType } from '@server/constants'

const ErrorPage = () => {

    const router = useRouter()
    let err_text
    let type = parseInt(router.query.type as string)

    switch (type) {
        case MsgPageType.CloseWindow: {
            err_text = t`Please close the window`
            window?.opener?.postMessage("refresh")
            break
        }
        case MsgPageType.OAuthAlreadyLinked:
            err_text = t`This provider is already linked to an account`
            break
        case MsgPageType.Forbidden:
            err_text = t`Forbidden`
            break
        case MsgPageType.LoginNotFound:
            err_text = t`Not found`
            break
        case MsgPageType.LoginDuplicateEmail:
            err_text = t`An existing user is already associated with the email associated with this provider`
            break
        default:
            err_text = t`Error`
            break
    }

    return (
    <MainLayout activeKey="error">
        <CenterPanel subtitle={err_text}></CenterPanel>
    </MainLayout>
    )
}

export default ErrorPage
