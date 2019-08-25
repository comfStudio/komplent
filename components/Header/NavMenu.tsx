import React, { Component } from 'react';
import { Navbar, Nav, Dropdown, Icon, IconButton } from 'rsuite';
import Link from 'next/link';

import NavUser from "./NavUser"
import MainSearch from '@components/App/MainSearch'
import { t } from '@app/utility/lang'

import LogoIcon from '@assets/images/logo.svg?sprite'

import "./NavMenu.scss"

interface Props {
    activeKey?: string
}

const NavMenu = (props: Props) => {
    return (
        <Navbar id="nav-menu">
            <Navbar.Header>
                <Link href="/">
                    <a href="#" className="navbar-brand logo"><Icon icon="" size="lg" /></a>
                </Link>
            </Navbar.Header>
            <Navbar.Body className="flex flex-1 justify-center">
            <Nav className="self-center flex-grow text-center">
                <MainSearch/>
            </Nav>
            <Nav activeKey={props.activeKey}>
                    <Link href="/how" passHref>
                        <Nav.Item eventKey="how">
                            {t`How It Works`}
                        </Nav.Item>
                    </Link>
                <Link href="/discover" passHref>
                    <Nav.Item eventKey="discover">
                            {t`Disover`}
                    </Nav.Item>
                </Link>
                <Link href="/login" passHref>
                    <Nav.Item eventKey="login">
                            {t`Login`}
                    </Nav.Item>
                </Link>
                <Dropdown className="nav-user-dropdown" placement="bottomRight" renderTitle={NavUser}>
                    <li className="dropdown-header">✦ Twiddly ✦</li>
                    <Link href="/profile" passHref>
                        <Dropdown.Item eventKey="profile">
                            {t`My Profile`}
                        </Dropdown.Item>
                    </Link>
                    <Link href="/mycommissions" passHref>
                        <Dropdown.Item eventKey="my_commissions">
                            {t`My Commissions`}
                        </Dropdown.Item>
                    </Link>
                    <Link href="/inbox" passHref>
                        <Dropdown.Item eventKey="inbox">
                            {t`Messages`}
                        </Dropdown.Item>
                    </Link>
                    <Link href="/earnings" passHref>
                        <Dropdown.Item eventKey="earnings">
                            {t`Earnings`}
                        </Dropdown.Item>
                    </Link>
                    <li className="dropdown-header">{t`Community`}</li>
                    <Link href="/followings" passHref>
                        <Dropdown.Item eventKey="followings">
                            {t`Followings`}
                        </Dropdown.Item>
                    </Link>
                    <li className="dropdown-header">{t`General`}</li>
                    <Link href="/settings" passHref>
                        <Dropdown.Item eventKey="settings">
                            {t`Settings`}
                        </Dropdown.Item>
                    </Link>
                    <Link href="/logout" passHref>
                        <Dropdown.Item eventKey="logout">
                            {t`Logout`}
                        </Dropdown.Item>
                    </Link>
                </Dropdown>
            </Nav>
            </Navbar.Body>
        </Navbar>
    )
}

export default NavMenu;