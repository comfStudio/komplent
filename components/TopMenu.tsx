import React, { Component } from 'react';

import { Menu, Icon } from 'antd';

const {SubMenu, Item, ItemGroup} = Menu

class TopMenu extends Component {
    render() {
        return (
            <Menu mode="horizontal" theme="dark">
            <Item key="home">Home</Item>
            </Menu>
        );
    }
}

export default TopMenu;