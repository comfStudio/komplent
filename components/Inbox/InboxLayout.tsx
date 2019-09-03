import React, { Component } from 'react';

import { Grid, Col, Row, InputGroup, Button, Icon} from 'rsuite'

import { Container, MainLayout } from '@components/App/MainLayout'
import InboxSidebar from '@components/Inbox/InboxSidebar'
import InboxSearch from '@components/Inbox/InboxSearch'
import InboxList from '@components/Inbox/InboxList'
import InboxConversation from '@components/Inbox/InboxConversation'

import { t } from '@app/utility/lang'

interface Props {
    activeKey?: string
}

const InboxLayout = (props: Props) => {
    return (
        <MainLayout activeKey="inbox">
            <Container padded>
                <Grid fluid>
                    <Row>
                        <Col xs={4}><Button><Icon icon="plus"/> {t`New conversation`}</Button></Col>
                        <Col xs={20}><InboxSearch/></Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={2}><InboxSidebar activeKey={props.activeKey}/></Col>
                        <Col xs={6}><InboxList/></Col>
                        <Col xs={16}><InboxConversation/></Col>
                    </Row>
                </Grid>
            </Container>
        </MainLayout>
    );
}

export default InboxLayout;