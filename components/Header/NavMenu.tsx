import React, { Component } from 'react';

import { Menu, Icon, Layout } from 'antd';

import NavSearch from './NavSearch'
import { t } from '@app/utility/lang'

const {SubMenu, Item, ItemGroup} = Menu
const {Header} = Layout


class NavMenu extends Component {
    render() {
        return (
            <Menu id="nav-menu" mode="horizontal" className="flex justify-center">
            <Icon className="text-2xl w-32 bg-gray-300 text-center logo" />
            <div className="text-center flex-grow">
                <NavSearch/>
            </div>
            <Item key="how_it_works">How It Works</Item>
            <Item key="discover">Disover</Item>
            <Item key="sell">Sell</Item>
            <Item key="user"><Icon type="user" className="text-2xl" /></Item>
            </Menu>
        );
    }
}

export default NavMenu;