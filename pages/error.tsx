import React from 'react'

import MainLayout, { CenterPanel } from '@components/App/MainLayout'
import { t } from '@app/utility/lang'
import { useRouter } from 'next/router'
import { ErrorPageType } from '@server/constants'

const ErrorPage = () => {

    const router = useRouter()
    let err_text
    let type = parseInt(router.query.type as string)

    switch (type) {
        case ErrorPageType.Forbidden:
            err_text = t`Forbidden`
            break
        case ErrorPageType.LoginNotFound:
            err_text = t`Not found`
            break
        case ErrorPageType.LoginDuplicateEmail:
            err_text = t`An existing user is already associated with the email associated with this login`
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
