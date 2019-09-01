import React, { Component } from 'react';

import { Grid, Col, Row, Panel, Pagination } from 'rsuite'

import UserCard from '@app/components/User/UserCard'

class ResultLayout extends Component {
    render() {
        return (
            <Panel bordered>
                <Grid fluid>
                    <Row className="text-center"><Pagination pages={10} activePage={1} last first next prev /></Row>
                    <Row>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                    </Row>
                    <Row className="text-center"><Pagination pages={10} activePage={1} last first next prev /></Row>
                </Grid>
            </Panel>
        );
    }
}

export default ResultLayout;