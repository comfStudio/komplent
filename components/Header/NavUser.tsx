import React from 'react';
import { Icon, Nav, Dropdown  } from 'rsuite';
import Link from 'next/link';

import { t } from '@app/utility/lang'

import "./NavUser.scss"

interface Props {
}

const NavUserAvatar = (props: Props) => {

    return (
        (<Nav.Item key="login" id="nav-user" {...props}>
            <Icon icon="user" size="2x" />
        </Nav.Item>)
    );
};

interface UserMenuProps {
    activeKey?: string
    element?: typeof Nav | typeof Dropdown
    dropdown?: boolean
}


export const NavUserMenu = (props: UserMenuProps) => {
    let El = props.element
    return [
        <Link href="/profile" passHref>
        <El.Item eventKey="profile" active={props.activeKey=='profile'}>
            {t`My Profile`}
        </El.Item>
        </Link>,
         <Link href="/dashboard" passHref>
                <El.Item eventKey="dashboard" active={props.activeKey=='dashboard'}>
                    {t`Dashboard`}
                </El.Item>
         </Link>,
        <Link href="/commissions" passHref>
            <El.Item eventKey="commissions" active={props.activeKey=='commissions'}>
                {t`Commissions`}
            </El.Item>
        </Link>,
        <Link href="/inbox" passHref>
            <El.Item eventKey="inbox" active={props.activeKey=='inbox'}>
                {t`Messages`}
            </El.Item>
        </Link>,
        <Link href="/earnings" passHref>
            <El.Item eventKey="earnings" active={props.activeKey=='earnings'}>
                {t`Earnings`}
            </El.Item>
        </Link>,
        !!props.dropdown && <li className="header">{t`Community`}</li>,
        !!!props.dropdown && <hr/>,
        <Link href="/hub" passHref>
            <El.Item eventKey="hub" active={props.activeKey=='hub'}>
                {t`Feedback Hub`}
            </El.Item>
        </Link>,
        !!props.dropdown && <li className="header">{t`General`}</li>,
        !!!props.dropdown && <hr/>,
        <Link href="/settings" passHref>
            <El.Item eventKey="settings" active={props.activeKey=='settings'}>
                {t`Settings`}
            </El.Item>
        </Link>,
        <Link href="/logout" passHref>
            <El.Item eventKey="logout" active={props.activeKey=='logout'}>
                {t`Logout`}
            </El.Item>
        </Link>
    ]
}

interface NavUserProps {
    activeKey?: string
}

export const NavUserDropdown = (props: NavUserProps) => {
    return (
        <Dropdown className="nav-user-dropdown" placement="bottomEnd" renderTitle={NavUserAvatar}>
        <li className="header">✦ Twiddly ✦</li>
        <NavUserMenu element={Dropdown} activeKey={props.activeKey} dropdown />
        </Dropdown>
    )
}

export const NavUserSidebar = (props: NavUserProps) => {
    return (
        <Nav vertical appearance="subtle" activeKey={props.activeKey} className="nav-user-sidebar">
        <NavUserMenu element={Nav} activeKey={props.activeKey}/>
        </Nav>
    )
}
