import React from 'react';
import { Navbar, Nav } from 'rsuite';
import Link from 'next/link';

import { Container } from '@components/App/MainLayout'

import { t } from '@app/utility/lang'

export interface Props {
    activeKey?: string
}

export const ProfileMenu = (props: Props) => {
    return (
        <Navbar className="">

            <Navbar.Body>
                <Container>
                    <Nav activeKey={props.activeKey}>
                        <Link href="/profile" passHref>
                            <Nav.Item eventKey="index" active={props.activeKey=='index'}>
                                {t`Information`}
                            </Nav.Item>
                        </Link>
                        <Link href="/profile/gallery" passHref>
                            <Nav.Item eventKey="gallery" active={props.activeKey=='gallery'}>
                                {t`Gallery`}
                            </Nav.Item>
                        </Link>
                        <Link href="/profile/recommendations" passHref>
                            <Nav.Item eventKey="recommendations" active={props.activeKey=='recommendations'}>
                                {t`Recommendations`}
                            </Nav.Item>
                        </Link>
                        <Link href="/profile/reviews" passHref>
                            <Nav.Item eventKey="reviews" active={props.activeKey=='reviews'}>
                                {t`Reviews`}
                            </Nav.Item>
                        </Link>
                        {/* <Link href="/profile/shop" passHref>
                            <Nav.Item eventKey="shop">
                                {t`Shop`}
                            </Nav.Item>
                        </Link> */}
                        <Link href="/profile/edit" passHref>
                            <Nav.Item eventKey="edit" active={props.activeKey=='edit'}>
                                {t`Edit Profile`}
                            </Nav.Item>
                        </Link>
                    </Nav>
                </Container>
            </Navbar.Body>
        </Navbar>

    );
}

export default ProfileMenu;