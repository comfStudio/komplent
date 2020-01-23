import React, { memo } from 'react'
import { Nav } from 'rsuite'

import { t } from '@app/utility/lang'
import Link from 'next/link'

interface Props {
    activeKey?: string
}

const DashboardMenu = memo(function DashboardMenu(props: Props) {
    return (
        <Nav appearance="subtle" activeKey={props.activeKey}>
            <Link href="/dashboard/activity" passHref>
                <Nav.Item
                    eventKey="activity"
                    active={
                        props.activeKey == 'activity'
                    }>{t`Newsfeed`}</Nav.Item>
            </Link>
        </Nav>
    )
})

export default DashboardMenu
