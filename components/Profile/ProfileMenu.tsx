import React, { Component } from 'react';
import { Menu, Icon, Layout, Avatar } from 'antd';
import Link from 'next/link';

import { t } from '@app/utility/lang'
import {ReactProps} from 'utility/props'

interface Props {
    selectedKeys?: string[]
}

const {SubMenu, Item, ItemGroup} = Menu

class ProfileMenu extends Component<Props> {
    render() {
        return (
            <Menu selectedKeys={this.props.selectedKeys} id="nav-menu" mode="horizontal" className="flex justify-center">
            <Item key="info">
                <Link href="#info">
                    <a>
                    {t`Information`}
                    </a>
                </Link>
            </Item>
            <Item key="recommendations">
                <Link href="#recommendations">
                    <a>
                    {t`Recommendations`}
                    </a>
                </Link>
            </Item>
            <Item key="shop">
                <Link href="#shop">
                    <a>
                    {t`Shop`}
                    </a>
                </Link>
            </Item>
            <Item key="edit">
                <Link href="edit_profile">
                    <a>
                    {t`Edit Profile`}
                    </a>
                </Link>
            </Item>
            </Menu>
        );
    }
}

export default ProfileMenu;