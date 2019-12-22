import React from 'react'
import Link from 'next/link'
import Button, { ButtonProps } from 'rsuite/lib/Button'
import { IconButton, Icon, ButtonGroup } from 'rsuite'

import { HTMLElementProps } from '@utility/props'
import { useProfileContext } from '@hooks/user'
import { make_profile_urlpath } from '@utility/pages'
import { t } from '@app/utility/lang'

interface CommissionButtonProps extends HTMLElementProps, ButtonProps {
    user?: any
}

export const CommissionButton = ({
    user,
    appearance = 'primary',
    size = 'lg',
    children,
    ...props
}: CommissionButtonProps) => {
    let path
    let count
    if (user) {
        path = make_profile_urlpath(user)
        count = user.commissions_open ? 1 : 0
    } else {
        const { profile_path, profile_user, slots_left } = useProfileContext()
        path = profile_path
        user = profile_user
        count = profile_user.commissions_open ? Math.max(0, slots_left) : 0
    }

    let cls = 'commission-button'

    let el = <Button
                appearance={appearance}
                size={size}
                className={
                    props.className
                        ? cls + ' ' + props.className
                        : cls
                }
                {...props}>
                {children ? children : t`Request a Commission`}
            </Button>

    return (
        <>
            {!!count && size !== 'lg' &&
            <Link href={`${path}/commission`}>
                <a className="unstyled">
                    {el}
                </a>
            </Link>
            }
            {!!count && size === 'lg' && (
                <Link href={`${path}/commission`}>
                    <a className="unstyled">
                        <ButtonGroup size={size}>
                            {el}
                            {!!count && count < 6 && (
                                <Button>{t`${count} slots left`}</Button>
                            )}
                        </ButtonGroup>
                    </a>
                </Link>
            )}
            {!!!count && (
                <Button size={size} disabled>
                    {t`Closed for commissions`}
                </Button>
            )}
        </>
    )
}

export default CommissionButton
