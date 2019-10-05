import React, { Component } from 'react';

import { Grid, Col, Row, Panel,
        CheckboxGroup, Checkbox, TagPicker,
        DateRangePicker, Slider } from 'rsuite'

class FiltersPanel extends Component {
    render() {
        return (
            <Panel bordered>
                <Grid fluid>
                    <Row>
                        <Col>
                            <Slider
                                defaultValue={25}
                                step={10}
                                graduated
                                progress
                                min={5}
                                max={50}
                                renderMark={mark => {
                                    if ([5, 15, 25, 50].includes(mark)) {
                                    return <span>{mark} $</span>;
                                    }
                                    return null;
                                }}
                                />
                        </Col>
                    </Row>
                    <Row>
                        <Col><DateRangePicker block/></Col>
                    </Row>
                    <Row>
                        <Col><TagPicker block data={[]}/></Col>
                    </Row>
                    <Row>
                        <Col>
                        <CheckboxGroup name="checkboxList">
                            <p>Group1</p>
                            <Checkbox>Item A</Checkbox>
                            <Checkbox>Item B</Checkbox>
                            <p>Group2</p>
                            <Checkbox>Item C</Checkbox>
                            <Checkbox disabled>Item D</Checkbox>
                        </CheckboxGroup>
                        </Col>
                    </Row>
                </Grid>
            </Panel>
        );
    }
}

export default FiltersPanel;