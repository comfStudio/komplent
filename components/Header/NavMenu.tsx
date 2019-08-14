import React, { Component } from 'react';
import { Menu, Icon, Layout, Avatar } from 'antd';
import Link from 'next/link';

import NavUser from "./NavUser"
import NavSearch from './NavSearch'
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
            <NavSearch/>
        </div>
        <Item key="how">
            <Link href="how">
                <a>
                {t`How It Works`}
                </a>
            </Link>
        </Item>
        <Item key="discover">{t`Disover`}</Item>
        <Item key="sell">{t`Sell`}</Item>
        <div className="px-5">
            <NavUser/>
        </div>
        </Menu>
    );
}

export default NavMenu;