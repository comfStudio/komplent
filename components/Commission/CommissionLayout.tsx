import React, { memo } from 'react'
import { Nav, Tag } from 'rsuite'
import Link from 'next/link'

import MainLayout from '@components/App/MainLayout'
import { useCommissionStore } from '@client/store/commission'
import { ReactProps } from '@utility/props'
import { t } from '@app/utility/lang'
import * as pages from '@utility/pages'
import { useUser } from '@hooks/user'
import UserCard from '@components/User/UserCard'
import { get_commission_title } from '@utility/misc'

import './Commission.scss'

interface MenuProps {
    activeKey?: string
}

const CommissionMenu = memo(function CommissionMenu(props: MenuProps) {
    const user = useUser()
    const store = useCommissionStore()
    let commission = store.get_commission()
    let is_owner = user?._id === commission.from_user._id

    return (
        <Nav className="mb-5" appearance="subtle" activeKey={props.activeKey}>
            <Link
                href={pages.commission + `/${commission._id}/description`}
                passHref>
                <Nav.Item
                    eventKey="description"
                    active={
                        props.activeKey == 'description'
                    }>{t`Overview`}</Nav.Item>
            </Link>
            <Link
                href={pages.commission + `/${commission._id}/timeline`}
                passHref>
                <Nav.Item
                    eventKey="timeline"
                    active={
                        props.activeKey == 'timeline'
                    }>{t`Timeline`}</Nav.Item>
            </Link>
            <Link href={pages.commission + `/${commission._id}/inbox`} passHref>
                <Nav.Item
                    eventKey="inbox"
                    active={props.activeKey == 'inbox'}>{t`Messages`}</Nav.Item>
            </Link>
            <Link
                href={pages.commission + `/${commission._id}/drafts`}
                passHref>
                <Nav.Item
                    eventKey="drafts"
                    active={
                        props.activeKey == 'drafts'
                    }>{t`Drafts`}</Nav.Item>
            </Link>
            <Link
                href={pages.commission + `/${commission._id}/assets`}
                passHref>
                <Nav.Item
                    eventKey="assets"
                    active={
                        props.activeKey == 'assets'
                    }>{t`Assets`}</Nav.Item>
            </Link>
            {!is_owner && (
                <Link
                    href={pages.commission + `/${commission._id}/options`}
                    passHref>
                    <Nav.Item
                        eventKey="options"
                        active={
                            props.activeKey == 'options'
                        }>{t`Options`}</Nav.Item>
                </Link>
            )}
        </Nav>
    )
})

interface Props extends ReactProps, MenuProps {}

export const CommissionLayout = memo(function CommissionLayout(props: Props) {
    const user = useUser()
    const store = useCommissionStore()
    let commission = store.get_commission()

    return (
        <MainLayout
            header={
                <div className="commission-header">
                    <UserCard noMessageButton commissionCountData={store.state.commission_count} data={user._id === commission.to_user._id ? commission.from_user : commission.to_user} bordered={false} small horizontal >
                        <span className="flex">
                            <h3 className="m-0 p-0 leading-none flex-grow-1">{get_commission_title(commission, user)}</h3>
                            <span>
                                {t`Current status`}:
                                <Tag color={"blue"}>{t`Queued`}</Tag>
                            </span>
                        </span>
                    </UserCard>
                    <CommissionMenu {...props} />
                </div>
            } paddedTop>
            {props.children}
        </MainLayout>
    )
})

export default CommissionLayout
