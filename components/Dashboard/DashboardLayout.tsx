import React from 'react';
import { Grid, Col, Row} from 'rsuite'

import MainLayout, { GridContainer } from '@components/App/MainLayout'
import DashboardMenu from '@components/Dashboard/DashboardMenu';
import { ReactProps } from '@app/utility/props';
import FollowingsList from './FollowingsList';
import { useLoginStatus } from '@hooks/auth';
import UserTypeModal from '@components/User/UserTypeModal';

interface Props extends ReactProps {
    activeKey?: string,
    pageProps?: object
}

const DashboardLayout = (props: Props) => {

    const logged_in = useLoginStatus()

    return (
        <MainLayout activeKey="dashboard" {...props.pageProps}>
            <GridContainer fluid padded>
                <Row>
                    <Col xs={17}>
                        <DashboardMenu activeKey={props.activeKey}/>
                        {!!logged_in && <UserTypeModal/>}
                        {props.children}
                    </Col>
                    <Col xs={7}><FollowingsList/></Col>
                </Row>
            </GridContainer>
        </MainLayout>
    );
};

export default DashboardLayout;