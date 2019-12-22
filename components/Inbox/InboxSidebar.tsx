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
            <Link href="/inbox" passHref>
                <Nav.Item
                    eventKey="inbox"
                    active={props.activeKey == 'inbox'}
                    icon={<Icon icon="home" />}>
                    {t`Inbox`}
                </Nav.Item>
            </Link>
            <hr />
            <Link href="/inbox/trash" passHref>
                <Nav.Item
                    eventKey="trash"
                    active={props.activeKey == 'trash'}
                    icon={<Icon icon="trash" />}>
                    {t`Trash`}
                </Nav.Item>
            </Link>
        </Nav>
    )
}

export default InboxSidebar
