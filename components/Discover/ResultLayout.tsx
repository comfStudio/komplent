import React, { Component } from 'react';

import { Grid, Col, Row, Panel } from 'rsuite'

import UserCard from '@app/components/User/UserCard'

class ResultLayout extends Component {
    render() {
        return (
            <Panel bordered>
                <Grid fluid>
                    <Row>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                    </Row>
                </Grid>
            </Panel>
        );
    }
}

export default ResultLayout;