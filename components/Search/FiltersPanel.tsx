import React, { useState, useReducer, useEffect } from 'react'

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
    Button,
    RadioGroup,
    Radio
} from 'rsuite'

import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props'
import * as pages from '@utility/pages'
import { useRouter } from 'next/router'
import useSearchStore from '@store/search'
import Link from 'next/link'

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

export interface FilterType {
    comm_status: string
}

const FiltersPanel = () => {

    const router = useRouter()
    const store = useSearchStore()
    
    const rquery: FilterType = router.query as any
    const initial_filters = {
        comm_status: rquery?.comm_status ?? 'any'
    } 

    const [query_url, set_query_url] = useState(router.asPath)
    const [first, set_first] = useState(true)
    const [dirty, set_dirty] = useState(false)
    const [state, dispatch] = useReducer((old_state: FilterType, new_state: FilterType) => {
        return {...old_state, ...new_state}
    }, initial_filters)

    useEffect(() => {
        if (!first) set_dirty(true)
        set_first(false)
        set_query_url(pages.make_search_urlpath(1, store.state.size, {...router.query, ...state}))
    }, [state])

    useEffect(() => {
        set_dirty(false)
    }, [router.asPath])

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
                            <p>
                                <label>{t`Commission Status`}</label>
                                <RadioGroup
                                    name="comm_status"
                                    inline
                                    appearance="picker"
                                    value={state.comm_status}
                                    onChange={v => {
                                        dispatch({comm_status: v})
                                    }}>
                                    <Radio value="any">{t`Any`}</Radio>
                                    <Radio value="open">{t`Open`}</Radio>
                                    <Radio value="closed">{t`Closed`}</Radio>
                                </RadioGroup>
                            </p>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center px-5">
                        <Link href={query_url} passHref>
                            <Button appearance={dirty ? 'primary' : 'default'} componentClass="a" block>{t`Apply`}</Button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center px-5 pb-5 pt-3">
                        <Button block onClick={ev => { ev.preventDefault(); dispatch(initial_filters); }}>{t`Clear all filters`}</Button>
                    </Col>
                </Row>
            </Grid>
        </Panel>
    )
}

export default FiltersPanel
