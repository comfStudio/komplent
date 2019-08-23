import React, { Component } from 'react';

import { Grid, Col, Row, Panel } from 'rsuite'

import CommissionCard from '@components/Commission/CommissionCard'

class ResultLayout extends Component {
    render() {
        return (
            <Panel bordered>
                <Grid fluid>
                    <Row>
                        <Col xs={10}><CommissionCard/></Col>
                        <Col xs={10}><CommissionCard/></Col>
                        <Col xs={10}><CommissionCard/></Col>
                        <Col xs={10}><CommissionCard/></Col>
                        <Col xs={10}><CommissionCard/></Col>
                    </Row>
                </Grid>
            </Panel>
        );
    }
}

export default ResultLayout;