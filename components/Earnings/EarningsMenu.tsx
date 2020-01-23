import React, { memo } from 'react'
import { Nav } from 'rsuite'

import { t } from '@app/utility/lang'
import Link from 'next/link'

interface Props {
    activeKey?: string
}

const EarningsMenu = memo(function EarningsMenu(props: Props) {
    return (
        <Nav appearance="subtle" activeKey={props.activeKey}>
            <Link href="/earnings" passHref>
                <Nav.Item
                    eventKey="status"
                    active={props.activeKey == 'status'}>{t`Status`}</Nav.Item>
            </Link>
            <Link href="/earnings/payout" passHref>
                <Nav.Item
                    eventKey="payout"
                    active={
                        props.activeKey == 'payout'
                    }>{t`Pay out balance`}</Nav.Item>
            </Link>
            <Link href="/earnings/history" passHref>
                <Nav.Item
                    eventKey="history"
                    active={
                        props.activeKey == 'history'
                    }>{t`History`}</Nav.Item>
            </Link>
        </Nav>
    )
})

export default EarningsMenu
