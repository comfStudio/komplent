import React from 'react'
import { Nav, Badge } from 'rsuite'
import Link from 'next/link'

import { t } from '@app/utility/lang'
import useUserStore from '@client/store/user'

interface Props {
    activeKey?: 'commissions' | 'requests' | 'assets'
}

const CommissionsMenu = (props: Props) => {
    const store = useUserStore()

    let active_comm_count = store.state.active_commissions_count

    if (store.state.current_user.type === 'consumer') {
        active_comm_count += store.state.active_requests_count
    }

    return (
        <Nav appearance="subtle" activeKey={props.activeKey}>
            <Link href="/commissions" passHref>
                <Nav.Item
                    eventKey="commissions"
                    active={props.activeKey == 'commissions'}>
                    {t`Commissions`} <Badge content={active_comm_count} />
                </Nav.Item>
            </Link>
            {store.state.current_user.type === 'creator' && (
                <>
                    <Link href="/commissions/requests" passHref>
                        <Nav.Item
                            eventKey="requests"
                            active={props.activeKey == 'requests'}>
                            {t`Requests`}{' '}
                            <Badge
                                content={store.state.active_requests_count}
                            />
                        </Nav.Item>
                    </Link>
                </>
            )}
            {/* <Link href="/assets" passHref>
                <Nav.Item
                    eventKey="assets"
                    active={props.activeKey == 'assets'}>
                    {t`Assets`}
                </Nav.Item>
            </Link> */}
        </Nav>
    )
}

export default CommissionsMenu
