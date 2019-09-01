import React, { Component } from 'react';

import { Grid, Col, Row, InputGroup, Button, Icon, Input} from 'rsuite'

import { Container, MainLayout } from '@components/App/MainLayout'
import InboxSidebar from '@components/Inbox/InboxSidebar'
import InboxSearch from '@components/Inbox/InboxSearch'

interface Props {
    activeKey?: string
}

const InboxLayout = (props: Props) => {
    return (
        <MainLayout activeKey="inbox">
            <Container padded>
                <Grid fluid>
                    <Row>
                        <Col xs={24}><InboxSearch/></Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={2}><InboxSidebar activeKey={props.activeKey}/></Col>
                        <Col xs={6}>Hello</Col>
                        <Col cx={16}>Hello</Col>
                    </Row>
                </Grid>
            </Container>
        </MainLayout>
    );
}

export default InboxLayout;