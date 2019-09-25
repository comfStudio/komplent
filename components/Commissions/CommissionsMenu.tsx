import React from 'react';
import { Nav } from 'rsuite';
import Link from 'next/link';

import { t } from '@app/utility/lang'

interface Props {
    activeKey?: string
}

const CommissionsMenu = (props: Props) => {
    return (
        <Nav appearance="subtle" activeKey={props.activeKey}>
            <Link href="/commissions/" passHref>
                <Nav.Item eventKey="commissions" active={props.activeKey=='commissions'}>{t`Commissions`}</Nav.Item>
            </Link>
            <Link href="/commissions/requests" passHref>
                <Nav.Item eventKey="requests" active={props.activeKey=='requests'}>{t`Requests`}</Nav.Item>
            </Link>
        </Nav>
    );
};

export default CommissionsMenu;