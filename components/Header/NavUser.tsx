import React, { useState } from 'react'
import { Icon, Nav, Dropdown, Badge } from 'rsuite'
import Link from 'next/link'

import { useUser, useProfileContext } from '@hooks/user'
import { make_profile_urlpath, get_profile_urlpart } from '@utility/pages'
import { t } from '@app/utility/lang'

import './NavUser.scss'
import { useMount } from 'react-use'
import useUserStore, { useNotificationStore } from '@store/user'
import { NoProfileContext } from '@client/context'
import { get_profile_name, get_image_url } from '@utility/misc'
import { useRouter } from 'next/router'
import useInboxStore from '@store/inbox'
import Image from '@components/App/Image'

interface Props {}

const NavUserAvatar = (props: Props) => {
    const user = useUser()
    const url = get_image_url(user.avatar, "icon")
    return (
        <Nav.Item key="login" id="nav-user" {...props}>
            {!!url && <Image className="avatar" src={url}/>}
            {!!!url && <Icon icon="user" size="2x" />}
        </Nav.Item>
    )
}

interface UserMenuProps {
    activeKey?: string
    element?: typeof Nav | typeof Dropdown
    dropdown?: boolean
}

export const NavUserMenu = (props: UserMenuProps) => {
    let El = props.element

    const router = useRouter()
    const user = useUser()
    const profile_owner = user.username === get_profile_urlpart(router.asPath).substring(1)

    const [dashboard_count, set_dashboard_count] = useState(0)
    const [followers_count, set_followers_count] = useState(0)
    const [followings_count, set_followings_count] = useState(0)
    const [unread_convo_count, set_unread_convo_count] = useState(0)

    useMount(() => {
        useNotificationStore.actions.get_notifications_count(user).then(r => {
            set_dashboard_count(r)
        })
        // useUserStore.actions.get_follow_count('followee', user).then(r => {
        //     set_followers_count(r)
        // })
        // useUserStore.actions.get_follow_count('follower', user).then(r => {
        //     set_followings_count(r)
        // })
        useInboxStore.actions.get_conversation_unread_count(user._id).then(r => {
            set_unread_convo_count(r)
        })
    })

    return (
        <React.Fragment>
            {user?.type === 'creator' && 
                <Link href={make_profile_urlpath(user)} passHref>
                    <El.Item
                        eventKey="profile"
                        active={props.activeKey == 'profile' && profile_owner}>
                        {t`My Page`}
                    </El.Item>
                </Link>
            }
            <Link href="/dashboard" passHref>
                <El.Item
                    eventKey="dashboard"
                    active={props.activeKey == 'dashboard'}>
                    <span>
                        {t`Dashboard`}
                        {!!dashboard_count && <Badge className="ml-2" content={dashboard_count} />}
                    </span>
                </El.Item>
            </Link>
            <Link href="/commissions" passHref>
                <El.Item
                    eventKey="commissions"
                    active={props.activeKey == 'commissions'}>
                    {t`Commissions`}
                </El.Item>
            </Link>
            <Link href="/inbox" passHref>
                <El.Item eventKey="inbox" active={props.activeKey == 'inbox'}>
                    <span>
                        {t`Messages`}
                        {!!unread_convo_count && <Badge className="ml-2"/>}
                    </span>
                </El.Item>
            </Link>
            {user?.type === 'creator' &&
                <Link href="/earnings" passHref>
                    <El.Item
                        eventKey="earnings"
                        active={props.activeKey == 'earnings'}>
                        {t`Earnings`}
                    </El.Item>
                </Link>
            }
            <Link href="/followings" passHref>
                <El.Item eventKey="followings" active={props.activeKey == 'followings'}>
                    {t`Followings`}
                </El.Item>
            </Link>
            {user?.type === 'creator' &&
                <Link href="/followers" passHref>
                    <El.Item
                        eventKey="followers"
                        active={props.activeKey == 'followers'}>
                        {t`Followers`}
                    </El.Item>
                </Link>
            }
            {/* {!!props.dropdown && <li className="header">{t`Community`}</li>}
            {!!!props.dropdown && <hr />}
            <Link href="/hub" passHref>
                <El.Item eventKey="hub" active={props.activeKey == 'hub'}>
                    {t`Feedback Hub`}
                </El.Item>
            </Link> */}
            {!!props.dropdown && <li className="header">{t`General`}</li>}
            {!!!props.dropdown && <hr />}
            <Link href="/settings" passHref>
                <El.Item
                    eventKey="settings"
                    active={props.activeKey == 'settings'}>
                    {t`Settings`}
                </El.Item>
            </Link>
            <Link href="/logout" passHref>
                <El.Item eventKey="logout" active={props.activeKey == 'logout'}>
                    {t`Logout`}
                </El.Item>
            </Link>
        </React.Fragment>
    )
}

interface NavUserProps {
    activeKey?: string
}

export const NavUserDropdown = (props: NavUserProps) => {
    const user = useUser()

    return (
        <NoProfileContext>
            <Dropdown
                className="nav-user-dropdown lg:!hidden"
                placement="bottomEnd"
                renderTitle={() => <NavUserAvatar/>}>
                <li className="header">✦ {get_profile_name(user)} ✦</li>
                <NavUserMenu
                    element={Dropdown}
                    activeKey={props.activeKey}
                    dropdown
                />
            </Dropdown>
        </NoProfileContext>
    )
}

export const NavUserSidebar = (props: NavUserProps) => {
    return (
        <Nav
            vertical
            appearance="subtle"
            activeKey={props.activeKey}
            className="nav-user-sidebar">
            <NavUserMenu element={Nav} activeKey={props.activeKey} />
        </Nav>
    )
}
