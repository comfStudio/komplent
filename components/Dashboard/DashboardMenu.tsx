import React from 'react';
import { Nav } from 'rsuite';

import { t } from '@app/utility/lang'
import Link from 'next/link';

interface Props {
    activeKey?: string
}

const DashboardMenu = (props: Props) => {
    return (
        <Nav appearance="subtle" activeKey={props.activeKey}>
            <Link href="/dashboard/activity" passHref>
                <Nav.Item eventKey="activity" active={props.activeKey=='activity'}>{t`Activity`}</Nav.Item>
            </Link>
            <Link href="/dashboard/followings" passHref>
                <Nav.Item eventKey="followings" active={props.activeKey=='followings'}>{t`Followings`}</Nav.Item>
            </Link>
        </Nav>
    );
};

export default DashboardMenu;