import React, { Component } from 'react';
import { Navbar, Nav } from 'rsuite';
import Link from 'next/link';

import { Container } from '@components/App/MainLayout'

import { t } from '@app/utility/lang'
import {ReactProps} from 'utility/props'

export interface Props {
    activeKey?: string
}

export class ProfileMenu extends Component<Props> {
    render() {
        return (
            <Navbar className="">

                <Navbar.Body>
                    <Container>
                        <Nav activeKey={this.props.activeKey}>
                            <Link href="/profile" passHref>
                                <Nav.Item eventKey="index">
                                    {t`Information`}
                                </Nav.Item>
                            </Link>
                            <Link href="/profile/gallery" passHref>
                                <Nav.Item eventKey="gallery">
                                    {t`Gallery`}
                                </Nav.Item>
                            </Link>
                            <Link href="/profile/recommendations" passHref>
                                <Nav.Item eventKey="recommendations">
                                    {t`Recommendations`}
                                </Nav.Item>
                            </Link>
                            <Link href="/profile/shop" passHref>
                                <Nav.Item eventKey="shop">
                                    {t`Shop`}
                                </Nav.Item>
                            </Link>
                            <Link href="/profile/edit" passHref>
                                <Nav.Item eventKey="edit">
                                    {t`Edit Profile`}
                                </Nav.Item>
                            </Link>
                        </Nav>
                    </Container>
                </Navbar.Body>
            </Navbar>

        );
    }
}

export default ProfileMenu;