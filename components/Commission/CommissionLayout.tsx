import React from 'react';
import { Nav } from 'rsuite';
import Link from 'next/link';

import MainLayout from '@components/App/MainLayout';
import { useCommissionStore } from '@client/store/commission';
import { ReactProps } from '@utility/props';
import { t } from '@app/utility/lang'
import * as pages from '@utility/pages';


interface MenuProps {
    activeKey?: string
}

const CommissionMenu = (props: MenuProps) => {

    const store = useCommissionStore()
    let commission = store.get_commission()

    return (
        <Nav className="mb-10" appearance="subtle" activeKey={props.activeKey}>
            <Link href={pages.commission + `/${commission._id}`} passHref>
                <Nav.Item eventKey="timeline" active={props.activeKey=='timeline'}>{t`Timeline`}</Nav.Item>
            </Link>
            <Link href={pages.commission + `/${commission._id}/inbox`} passHref>
                <Nav.Item eventKey="inbox" active={props.activeKey=='inbox'}>{t`Messages`}</Nav.Item>
            </Link>
            <Link href={pages.commission + `/${commission._id}/description`} passHref>
                <Nav.Item eventKey="description" active={props.activeKey=='description'}>{t`Description`}</Nav.Item>
            </Link>
            <Link href={pages.commission + `/${commission._id}/products`} passHref>
                <Nav.Item eventKey="products" active={props.activeKey=='products'}>{t`Products`}</Nav.Item>
            </Link>
        </Nav>
    );
};

interface Props extends ReactProps, MenuProps {
}

export const CommissionLayout = (props: Props) => {
    const store = useCommissionStore()
    let commission = store.get_commission()
    
    return (
        <MainLayout>
            <h3 className="pb-1 mb-2">{commission.from_title}</h3>
            <CommissionMenu {...props}/>
            {props.children}
        </MainLayout>
    )
};

export default CommissionLayout;