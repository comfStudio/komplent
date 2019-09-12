import React from 'react';
import { Grid, Col, Row} from 'rsuite'

import MainLayout, { GridContainer } from '@components/App/MainLayout'
import ActiveCommissions from '@components/Dashboard/ActiveCommissions';
import DashboardMenu from '@components/Dashboard/DashboardMenu';
import { ReactProps } from '@app/utility/props';

interface Props extends ReactProps {
    activeKey?: string,
    pageProps?: object
}

const DashboardLayout = (props: Props) => {
    return (
        <MainLayout activeKey="dashboard" {...props.pageProps}>
            <GridContainer fluid padded>
                <Row>
                    <Col xs={17}>
                        <DashboardMenu activeKey={props.activeKey}/>
                        {props.children}
                    </Col>
                    <Col xs={7}><ActiveCommissions/></Col>
                </Row>
            </GridContainer>
        </MainLayout>
    );
};

export default DashboardLayout;