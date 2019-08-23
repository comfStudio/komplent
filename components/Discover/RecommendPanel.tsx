import React, { Component } from 'react';

import { Grid, Col, Row, Panel } from 'rsuite'

import CommissionCard from '@components/Commission/CommissionCard'

class RecommendPanel extends Component {
    render() {
        return (
            <Panel bordered header={<h3>Hot Picks</h3>}>
                <Grid fluid>
                    <Row>
                        <Col xs={24}><CommissionCard/></Col>
                        <Col xs={24}><CommissionCard/></Col>
                        <Col xs={24}><CommissionCard/></Col>
                    </Row>
                </Grid>
            </Panel>
        );
    }
}

export default RecommendPanel;