import React, { Component } from 'react'
import { Navbar, Nav, Dropdown, Icon, IconButton } from 'rsuite'
import Link from 'next/link'

import { NavUserDropdown } from './NavUser'
import MainSearch from '@components/App/MainSearch'
import { t } from '@app/utility/lang'

import { useLoginStatus } from '@hooks/auth'

import './NavMenu.scss'

interface Props {
    activeKey?: string
}

export const NavMenu = (props: Props) => {
    const logged_in = useLoginStatus()

    return (
        <Navbar id="nav-menu">
            <Navbar.Header></Navbar.Header>
            <Navbar.Body className="flex flex-1 justify-center">
                <Nav className="self-center flex-grow text-center">
                    <MainSearch />
                </Nav>
                <Nav activeKey={props.activeKey}>
                    {/* <Link href="/how" passHref>
                        <Nav.Item
                            eventKey="how"
                            active={props.activeKey == 'how'}>
                            {t`How It Works`}
                        </Nav.Item>
                    </Link> */}
                    <Link href="/discover" passHref>
                        <Nav.Item
                            eventKey="discover"
                            active={props.activeKey == 'discover'}>
                            {t`Explore`}
                        </Nav.Item>
                    </Link>
                    {!logged_in && (
                        <Link href="/join" passHref>
                            <Nav.Item
                                eventKey="join"
                                active={props.activeKey == 'join'}>
                                {t`Join`}
                            </Nav.Item>
                        </Link>
                    )}
                    {!logged_in && (
                        <Link href="/login" passHref>
                            <Nav.Item
                                eventKey="login"
                                active={props.activeKey == 'login'}>
                                {t`Login`}
                            </Nav.Item>
                        </Link>
                    )}
                    {logged_in && <NavUserDropdown />}
                </Nav>
            </Navbar.Body>
        </Navbar>
    )
}

export default NavMenu
