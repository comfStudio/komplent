import React, { useEffect, memo } from 'react'
import Router from 'next/router'

import * as pages from '@utility/pages'
import { ReactProps } from '@app/utility/props'
import { useLoginStatus } from '@hooks/auth'

interface Props extends ReactProps {
    inverse?: boolean
}

export const NoLoginPage = () => {
    const logged_in = useLoginStatus()
    useEffect(() => {
        if (logged_in) {
            Router.replace(pages.dashboard)
        }
    }, [logged_in])
    return null
}

export const Auth = memo(function Auth(props: Props) {
    const logged_in = useLoginStatus()

    useEffect(() => {
        if (props.inverse) {
            if (logged_in) {
                Router.push(pages.home)
            }
        } else {
            if (!logged_in) {
                Router.push(pages.login)
            }
        }
    }, [logged_in])

    return (
        ((logged_in && !props.inverse) || (!logged_in && props.inverse)) &&
        props.children
    )
})

export default Auth
