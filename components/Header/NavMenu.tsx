import React, { Component } from 'react';
import { Navbar, Nav, Dropdown, Icon, IconButton } from 'rsuite';
import Link from 'next/link';

import NavUser from "./NavUser"
import MainSearch from '@components/App/MainSearch'
import { t } from '@app/utility/lang'

import "./NavMenu.scss"

interface Props {
    selectedKeys?: string[]
}

const NavMenu = (props: Props) => {
    return (
        <Navbar id="nav-menu">
            <Navbar.Header>
                <Link href="how">
                    <a href="#" className="navbar-brand logo">KOMPLENT</a>
                </Link>
            </Navbar.Header>
            <Navbar.Body className="flex flex-1 justify-center">
            <Nav className="self-center flex-grow text-center">
                <MainSearch/>
            </Nav>
            <Nav>
                <Link href="how">
                    <Nav.Item key="how">
                        {t`How It Works`}
                    </Nav.Item>
                </Link>
                <Link href="discover">
                    <Nav.Item key="discover">
                            {t`Disover`}
                    </Nav.Item>
                </Link>
                <Link href="commissions">
                    <Nav.Item key="commissions">
                            {t`Commissions`}
                    </Nav.Item>
                </Link>
                <Link href="login">
                    <Nav.Item key="login">
                            {t`Login`}
                    </Nav.Item>
                </Link>
                <Dropdown className="nav-user-dropdown" placement="bottomRight" renderTitle={()=>{
                            return (<Nav.Item key="login" id="nav-user">
                                        <Icon icon="user" size="2x" />
                                    </Nav.Item>)
                            return <IconButton appearance="primary" icon={<Icon icon="user" size="2x" />} />
                        }}>
                    <li className="dropdown-header">✦ Twiddly ✦</li>
                    <Dropdown.Item key="profile" componentClass="div">
                        <Link href="profile">
                            <a>
                                {t`My Profile`}
                            </a>
                        </Link>
                     </Dropdown.Item>
                     <Dropdown.Item key="my_commissions" componentClass="div">
                        <Link href="">
                            <a>
                            {t`My Commissions`}
                            </a>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item key="inbox" componentClass="div">
                        <Link href="inbox">
                            <a>
                            {t`Messages`}
                            </a>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item key="earnings" componentClass="div">
                        <Link href="">
                            <a>
                            {t`Earnings`}
                            </a>
                        </Link>
                    </Dropdown.Item>
                    <li className="dropdown-header">{t`Community`}</li>
                    <Dropdown.Item key="followings" componentClass="div">
                        <Link href="">
                            <a>
                            {t`Followings`}
                            </a>
                        </Link>
                    </Dropdown.Item>
                    <li className="dropdown-header">{t`General`}</li>
                    <Dropdown.Item key="settings" componentClass="div">
                        <Link href="settings">
                            <a>
                            {t`Settings`}
                            </a>
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item key="logout" componentClass="div">
                            <Link href="logout">
                                <a>
                                {t`Logout`}
                                </a>
                            </Link>
                    </Dropdown.Item>
                </Dropdown>
            </Nav>
            </Navbar.Body>
        </Navbar>
    )
        {/* <SubMenu title={<div className=""><NavUser/></div>}>
            <ItemGroup title="✦ Twiddly ✦">
               
         
                <Item key="earnings">
                    <Link href="">
                        <a>
                        {t`Earnings`}
                        </a>
                    </Link>
                </Item>
            </ItemGroup>
            <ItemGroup title={t`Community`}>
                <Item key="followings">
                    <Link href="">
                        <a>
                        {t`Followings`}
                        </a>
                    </Link>
                </Item>
            </ItemGroup>
            <ItemGroup title={t`General`}>
                <Item key="settings">
                    <Link href="settings">
                        <a>
                        {t`Settings`}
                        </a>
                    </Link>
                </Item>
                <Item key="logout">
                        <Link href="logout">
                            <a>
                            {t`Logout`}
                            </a>
                        </Link>
                </Item>
            </ItemGroup>
        </SubMenu> */}
}

export default NavMenu;