import React, { Component } from 'react';
import { Navbar, Nav, Dropdown, Icon, IconButton } from 'rsuite';
import Link from 'next/link';

import {NavUserDropdown} from "./NavUser"
import MainSearch from '@components/App/MainSearch'
import { t } from '@app/utility/lang'

import LogoIcon from '@assets/images/logo.svg?sprite'

interface Props {
    activeKey?: string
}

export const NavMenu = (props: Props) => {
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
                        <Nav.Item eventKey="how" active={props.activeKey=='how'}>
                            {t`How It Works`}
                        </Nav.Item>
                    </Link>
                <Link href="/discover" passHref>
                    <Nav.Item eventKey="discover" active={props.activeKey=='discover'}>
                            {t`Disover`}
                    </Nav.Item>
                </Link>
                <Link href="/login" passHref>
                    <Nav.Item eventKey="login" active={props.activeKey=='login'}>
                            {t`Login`}
                    </Nav.Item>
                </Link>
                <NavUserDropdown/>
            </Nav>
            </Navbar.Body>
        </Navbar>
    )
}

export default NavMenu;