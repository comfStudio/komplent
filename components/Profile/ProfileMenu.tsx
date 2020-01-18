import React from 'react'
import { Navbar, Nav } from 'rsuite'
import Link from 'next/link'

import { Container } from '@components/App/MainLayout'
import { useProfileUser } from '@hooks/user'
import { t } from '@app/utility/lang'

export interface Props {
    activeKey?: string
}

export const ProfileMenu = (props: Props) => {
    const {
        context: { profile_path, profile_owner },
    } = useProfileUser()

    return (
        <Navbar className="small">
            <Navbar.Body>
                <Container>
                    <Nav activeKey={props.activeKey}>
                        <Link href={`${profile_path}`} passHref>
                            <Nav.Item
                                eventKey="index"
                                active={props.activeKey == 'index'}>
                                {t`Overview`}
                            </Nav.Item>
                        </Link>
                        <Link href={`${profile_path}/gallery`} passHref>
                            <Nav.Item
                                eventKey="gallery"
                                active={props.activeKey == 'gallery'}>
                                {t`Gallery`}
                            </Nav.Item>
                        </Link>
                        {/* <Link href={`${profile_path}/recommendations`} passHref>
                            <Nav.Item eventKey="recommendations" active={props.activeKey=='recommendations'}>
                                {t`Recommendations`}
                            </Nav.Item>
                        </Link> */}
                        {/* <Link href={`${profile_path}/reviews`} passHref>
                            <Nav.Item eventKey="reviews" active={props.activeKey=='reviews'}>
                                {t`Reviews`}
                            </Nav.Item>
                        </Link> */}
                        {/* <Link href="/profile/shop" passHref>
                            <Nav.Item eventKey="shop">
                                {t`Shop`}
                            </Nav.Item>
                        </Link> */}
                        {profile_owner && (
                            <Link href={`${profile_path}/edit`} passHref>
                                <Nav.Item
                                    eventKey="edit"
                                    active={props.activeKey == 'edit'}>
                                    {t`Edit Page`}
                                </Nav.Item>
                            </Link>
                        )}
                        {props.activeKey == 'commission' &&
                        <Link href={`${profile_path}/commission`} passHref>
                            <Nav.Item
                                eventKey="commission"
                                active={props.activeKey == 'commission'}>
                                {t`Requesting a Commission`}
                            </Nav.Item>
                        </Link>
                        }
                    </Nav>
                </Container>
            </Navbar.Body>
        </Navbar>
    )
}

export default ProfileMenu
