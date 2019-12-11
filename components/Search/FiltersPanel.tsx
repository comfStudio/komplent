import React, { useState } from 'react'

import {
    Grid,
    Col,
    Row,
    Panel,
    CheckboxGroup,
    Checkbox,
    TagPicker,
    DateRangePicker,
    Slider,
    Sidenav,
    Nav,
    Icon,
    Dropdown,
    Button
} from 'rsuite'

import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props'


const FiltersItem = (props: ReactProps) => {
    return (
        <Panel>
            <Grid fluid>
                {props.children}
            </Grid>
        </Panel>
    )
}

const Category = () => {
    return (
        <FiltersItem>
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
                                return <span>{mark} $</span>
                            }
                            return null
                        }}
                    />
                </Col>
            </Row>
        </FiltersItem>
    )
}

const Price = () => {
    return (
        <FiltersItem>
            <Row>
                <Col>
                    <DateRangePicker block />
                    
                </Col>
                <Col>
                    <TagPicker block data={[]} />
                </Col>
            </Row>
        </FiltersItem>
    )
}

const Style = () => {
    return (
        <FiltersItem>
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
        </FiltersItem>
    )
}

const Subject = () => {
    return (
        <FiltersItem>
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
        </FiltersItem>
    )
}

const FiltersPanel = () => {

    const [dirty, set_dirty] = useState(true)

    return (
        <Panel bordered bodyFill>
            <Grid fluid>
                <Row>
                    <Sidenav appearance="subtle" defaultOpenKeys={['category', 'price']} activeKey="category">
                        <Sidenav.Body>
                            <Nav>
                            <Dropdown eventKey="category" title={t`Category`} icon={<Icon icon="magic" />}><Category/></Dropdown>
                            <Dropdown eventKey="style" title={t`Style`} icon={<Icon icon="magic" />}><Style/></Dropdown>
                            <Dropdown eventKey="subject" title={t`Subject`} icon={<Icon icon="magic" />}><Subject/></Dropdown>
                            <Dropdown eventKey="price" title={t`Price`} icon={<Icon icon="magic" />}><Price/></Dropdown>
                            </Nav>
                        </Sidenav.Body>
                        </Sidenav>
                </Row>
                <Row>
                    <Col>
                        <Panel>
                            <CheckboxGroup name="options">
                                <p>Group1</p>
                                <Checkbox>Item A</Checkbox>
                                <Checkbox>Item B</Checkbox>
                                <p>Group2</p>
                                <Checkbox>Item C</Checkbox>
                                <Checkbox disabled>Item D</Checkbox>
                            </CheckboxGroup>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center px-5">
                        <Button appearance={dirty ? 'primary' : 'default'} block>{t`Apply`}</Button>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center px-5 pb-5 pt-3">
                        <Button block>{t`Clear all filters`}</Button>
                    </Col>
                </Row>
            </Grid>
        </Panel>
    )
}

export default FiltersPanel
