import React, { Component } from 'react';

import { Grid, Col, Row, Panel, PanelGroup } from 'rsuite'

import UserCard from '@app/components/User/UserCard'

class RecommendPanel extends Component {
    render() {
        return (
            <Panel bordered header={<h3>Recommended</h3>}>
                <PanelGroup>
                    {/* <UserCard/>
                    <UserCard/>
                    <UserCard/> */}
                </PanelGroup>
            </Panel>
        );
    }
}

export default RecommendPanel;