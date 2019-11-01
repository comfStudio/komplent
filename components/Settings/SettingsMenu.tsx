import React from 'react';
import { Nav } from 'rsuite';
import Link from 'next/link';

import { t } from '@app/utility/lang'
import useUserStore from '@client/store/user';

interface Props {
    activeKey?: string
}

const SettingsMenu = (props: Props) => {

    const store = useUserStore()

    return (
        <Nav appearance="subtle" activeKey={props.activeKey}>
            <Link href="/settings" passHref>
                <Nav.Item eventKey="user" active={props.activeKey=='user'}>{t`User Settings`}</Nav.Item>
            </Link>
            {store.state.current_user.type === 'creator' &&
            <>
            <Link href="/settings/commissions" passHref>
                <Nav.Item eventKey="commissions" active={props.activeKey=='commissions'}>{t`Commissions Settings`}</Nav.Item>
            </Link>
            </>
            }
        </Nav>
    );
};

export default SettingsMenu;