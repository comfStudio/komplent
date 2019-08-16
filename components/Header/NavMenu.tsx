import React, { Component } from 'react';
import { Menu, Icon, Layout, Avatar } from 'antd';
import Link from 'next/link';

import NavUser from "./NavUser"
import MainSearch from '@components/App/MainSearch'
import { t } from '@app/utility/lang'

const {SubMenu, Item, ItemGroup} = Menu
const {Header} = Layout

interface Props {
    selectedKeys?: string[]
}

const NavMenu = (props: Props) => {
    return (
        <Menu selectedKeys={props.selectedKeys} id="nav-menu" mode="horizontal" className="flex justify-center">
        <Link href="index">
            <a className="text-2xl w-32 bg-gray-300 text-center logo">
            </a>
        </Link>
        <div className="text-center flex-grow">
            <MainSearch/>
        </div>
        <Item key="how">
            <Link href="how">
                <a>
                {t`How It Works`}
                </a>
            </Link>
        </Item>
        <Item key="discover">
            <Link href="discover">
                <a>
                {t`Disover`}
                </a>
            </Link>
        </Item>
        <Item key="commissions">
            <Link href="commissions">
                <a>
                {t`Commissions`}
                </a>
            </Link>
        </Item>
        <Item key="login">
            <Link href="login">
                <a>
                {t`Login`}
                </a>
            </Link>
        </Item>
        <SubMenu title={<div className=""><NavUser/></div>}>
            <ItemGroup title="✦ Twiddly ✦">
                <Item key="profile">
                    <Link href="profile">
                        <a>
                        {t`My Profile`}
                        </a>
                    </Link>
                </Item>
                <Item key="my_commissions">
                    <Link href="">
                        <a>
                        {t`My Commissions`}
                        </a>
                    </Link>
                </Item>
                <Item key="inbox">
                    <Link href="inbox">
                        <a>
                        {t`Messages`}
                        </a>
                    </Link>
                </Item>
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
        </SubMenu>
        </Menu>
    );
}

export default NavMenu;