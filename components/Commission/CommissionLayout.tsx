import React from 'react';
import { Nav, Tag } from 'rsuite';
import Link from 'next/link';

import MainLayout from '@components/App/MainLayout';
import { useCommissionStore } from '@client/store/commission';
import { ReactProps } from '@utility/props';
import { t } from '@app/utility/lang'
import * as pages from '@utility/pages';
import { useUser } from '@hooks/user';


interface MenuProps {
    activeKey?: string
}

const CommissionMenu = (props: MenuProps) => {
    const user = useUser()
    const store = useCommissionStore()
    let commission = store.get_commission()
    let is_owner = user._id === commission.from_user._id

    return (
        <Nav className="mb-5" appearance="subtle" activeKey={props.activeKey}>
            <Link href={pages.commission + `/${commission._id}/description`} passHref>
                <Nav.Item eventKey="description" active={props.activeKey=='description'}>{t`Description`}</Nav.Item>
            </Link>
            <Link href={pages.commission + `/${commission._id}/timeline`} passHref>
                <Nav.Item eventKey="timeline" active={props.activeKey=='timeline'}>{t`Timeline`}</Nav.Item>
            </Link>
            <Link href={pages.commission + `/${commission._id}/inbox`} passHref>
                <Nav.Item eventKey="inbox" active={props.activeKey=='inbox'}>{t`Messages`}</Nav.Item>
            </Link>
            <Link href={pages.commission + `/${commission._id}/products`} passHref>
                <Nav.Item eventKey="products" active={props.activeKey=='products'}>{t`Products`}</Nav.Item>
            </Link>
            {!is_owner && 
            <Link href={pages.commission + `/${commission._id}/options`} passHref>
                <Nav.Item eventKey="options" active={props.activeKey=='options'}>{t`Options`}</Nav.Item>
            </Link>
            }
        </Nav>
    );
};

interface Props extends ReactProps, MenuProps {
}

export const CommissionLayout = (props: Props) => {
    const store = useCommissionStore()
    let commission = store.get_commission()
    
    return (
        <MainLayout header={
        <>
        <h3 className="pb-1 mb-2">
            <small>
                <Link href={pages.make_profile_urlpath(commission.from_user)}>
                    <Tag componentClass="a">{commission.from_user.username}</Tag>
                </Link>
                 →
                <Link href={pages.make_profile_urlpath(commission.to_user)}>
                    <Tag componentClass="a">{commission.to_user.username}</Tag>
                </Link>
            </small> {commission.from_title}</h3>
        <CommissionMenu {...props}/>
        </>}>
            {props.children}
        </MainLayout>
    )
};

export default CommissionLayout;