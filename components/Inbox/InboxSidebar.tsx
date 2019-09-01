import React from 'react';
import Link from 'next/link'
import { Nav, Icon} from 'rsuite'

import { t } from '@app/utility/lang'

interface Props {
    activeKey?: string
  }

const InboxSidebar = (props: Props) => {
    return (
        <Nav vertical appearance="subtle" activeKey={props.activeKey}>
            <Link href="/inbox/new" passHref>
                <Nav.Item eventKey="new" icon={<Icon icon="home" />}>
                    {t`New`}
                </Nav.Item>
            </Link>
            <Link href="/inbox/active" passHref>
                <Nav.Item eventKey="active" icon={<Icon icon="home" />}>
                    {t`Active`}
                </Nav.Item>
            </Link>
            <Link href="/inbox/private" passHref>
                <Nav.Item eventKey="private" icon={<Icon icon="home" />}>
                    {t`Private`}
                </Nav.Item>
            </Link>
            <Link href="/inbox/staff" passHref>
                <Nav.Item eventKey="staff" icon={<Icon icon="home" />}>
                    {t`Staff`}
                </Nav.Item>
            </Link>
        </Nav>
    );
};

export default InboxSidebar;