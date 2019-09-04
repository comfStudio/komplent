import React, { Component } from 'react';

import { Grid, Col, Row} from 'rsuite'

import { Container, GridContainer } from '@components/App/MainLayout'

import FiltersPanel from '@components/Discover/FiltersPanel'
import ResultLayout from '@components/Discover/ResultLayout'
import RecommendPanel from '@components/Discover/RecommendPanel'

class DiscoverLayout extends Component {
    render() {
        return (
            <GridContainer padded fluid>
                <Row>
                    <Col xs={6}><FiltersPanel/></Col>
                    <Col xs={12}><ResultLayout/></Col>
                    <Col xs={6}><RecommendPanel/></Col>
                </Row>
            </GridContainer>
        );
    }
}

export default DiscoverLayout;