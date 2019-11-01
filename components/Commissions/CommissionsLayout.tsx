import React from 'react';
import { Grid, Col, Row} from 'rsuite'

import MainLayout, { GridContainer } from '@components/App/MainLayout'
import CommissionsMenu from '@components/Commissions/CommissionsMenu';
import { ReactProps } from '@app/utility/props';
import { RequireOwnProfile, RequireCreator } from '@components/Profile';

interface Props extends ReactProps {
    activeKey?: string
}

const CommissionsLayout = (props: Props) => {
    return (
        <MainLayout activeKey="commissions" paddedTop header={<CommissionsMenu activeKey={props.activeKey}/>}>
            <GridContainer fluid>
                <Row>
                    <Col xs={24}>
                        {props.children}
                    </Col>
                </Row>
            </GridContainer>
        </MainLayout>
    );
};

export default CommissionsLayout;