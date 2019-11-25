import React from 'react'
import Link from 'next/link'
import { Nav, Icon } from 'rsuite'

import { t } from '@app/utility/lang'

interface Props {
    activeKey?: string
}

const InboxSidebar = (props: Props) => {
    return (
        <Nav vertical appearance="subtle" activeKey={props.activeKey}>
            <Link href="/inbox/active" passHref>
                <Nav.Item
                    eventKey="active"
                    active={props.activeKey == 'active'}
                    icon={<Icon icon="home" />}>
                    {t`Active`}
                </Nav.Item>
            </Link>
            <Link href="/inbox/archive" passHref>
                <Nav.Item
                    eventKey="archive"
                    active={props.activeKey == 'archive'}
                    icon={<Icon icon="home" />}>
                    {t`Archive`}
                </Nav.Item>
            </Link>
            <hr />
            <Link href="/inbox/staff" passHref>
                <Nav.Item
                    eventKey="staff"
                    active={props.activeKey == 'staff'}
                    icon={<Icon icon="home" />}>
                    {t`Staff`}
                </Nav.Item>
            </Link>
            <hr />
            <Link href="/inbox/trash" passHref>
                <Nav.Item
                    eventKey="trash"
                    active={props.activeKey == 'trash'}
                    icon={<Icon icon="home" />}>
                    {t`Trash`}
                </Nav.Item>
            </Link>
        </Nav>
    )
}

export default InboxSidebar
