import React from 'react';
import { Grid, Col, Row} from 'rsuite'

import MainLayout, { GridContainer } from '@components/App/MainLayout'
import CommissionsMenu from '@components/Commissions/CommissionsMenu';
import { ReactProps } from '@app/utility/props';

interface Props extends ReactProps {
    activeKey?: string
}

const CommissionsLayout = (props: Props) => {
    return (
        <MainLayout activeKey="commissions">
            <GridContainer fluid padded>
                <Row>
                    <Col xs={24}>
                        <CommissionsMenu activeKey={props.activeKey}/>
                        {props.children}
                    </Col>
                </Row>
            </GridContainer>
        </MainLayout>
    );
};

export default CommissionsLayout;