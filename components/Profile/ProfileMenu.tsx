import React, { Component } from 'react';
import { Menu, Icon, Layout, Avatar } from 'rsuite';
import Link from 'next/link';

import { Container } from '@components/App/MainLayout'

import { t } from '@app/utility/lang'
import {ReactProps} from 'utility/props'

export interface Props {
    selectedKeys?: string[]
}

const {SubMenu, Item, ItemGroup} = Menu

export class ProfileMenu extends Component<Props> {
    render() {
        return (
            <div className="komplent-menu komplent-menu-light komplent-menu-root komplent-menu-horizontal">
            <Container>

            <Menu selectedKeys={this.props.selectedKeys} id="nav-menu" mode="horizontal" className="">
            <Item key="index">
                <Link href="/profile">
                    <a>
                    {t`Information`}
                    </a>
                </Link>
            </Item>
            <Item key="gallery">
                <Link href="/profile/gallery">
                    <a>
                    {t`Gallery`}
                    </a>
                </Link>
            </Item>
            <Item key="recommendations">
                <Link href="/profile/recommendations">
                    <a>
                    {t`Recommendations`}
                    </a>
                </Link>
            </Item>
            <Item key="shop">
                <Link href="/profile/shop">
                    <a>
                    {t`Shop`}
                    </a>
                </Link>
            </Item>
            <Item key="edit">
                <Link href="/profile/edit">
                    <a>
                    {t`Edit Profile`}
                    </a>
                </Link>
            </Item>
            </Menu>
            </Container>

            </div>
        );
    }
}

export default ProfileMenu;