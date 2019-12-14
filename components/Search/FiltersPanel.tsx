import React, { useState, useReducer, useEffect } from 'react'
import qs from 'qs'

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
import { NSFW_LEVEL, NSFWType } from '@server/constants'
import { useUser } from '@hooks/user'
import _ from 'lodash'

export interface FilterType {
    delivery_time: string
    comm_status: string
    location: string
    nsfw_level: NSFWType
    categories: any[]
    styles: any[]
}

interface FiltersItemProps {
    state: FilterType
    dispatch: (state: Partial<FilterType>) => void
}

const FiltersItem = (props: ReactProps) => {
    return (
        <Panel>
            <Grid fluid>
                {props.children}
            </Grid>
        </Panel>
    )
}

const Category = (props: FiltersItemProps) => {
    const store = useSearchStore()

    return (
        <FiltersItem>
            <Row>
                <Col>
                    <Checkbox value="select_all" checked={props.state.categories.length === store.state.categories.length} onChange={(_, c) => props.dispatch({categories: store.state.categories.map(v => v.identifier)})}>{t`Select all`}</Checkbox>
                    <Checkbox value="reset" checked={!props.state.categories.length} onChange={(_, c) => props.dispatch({categories: []})}>{t`Reset`}</Checkbox>
                    <CheckboxGroup value={props.state.categories} name="categories" onChange={v => {
                        props.dispatch({categories: v})
                    }}>
                        {store.state.categories.map(v => <Checkbox key={v._id} value={v.identifier}>{v.name}</Checkbox>)}
                    </CheckboxGroup>
                </Col>
            </Row>
        </FiltersItem>
    )
}

const Price = (props: FiltersItemProps) => {
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
                <Col>
                    <TagPicker block data={[]} />
                </Col>
            </Row>
        </FiltersItem>
    )
}

const Style = (props: FiltersItemProps) => {

    const store = useSearchStore()
    const [tags, set_tags] = useState([])

    useEffect(() => {
        store.load_styles(props.state.categories, store.state.categories).then(r => {
            set_tags(r)
            let v_ids = r.map(v => v.identifier)
            props.dispatch({styles: props.state.styles.filter(v => v_ids.includes(v))})
        })
    }, [props.state.categories])

    return (
        <FiltersItem>
            <Row>
                <Col>
                    <Checkbox value="select_all" checked={props.state.styles.length && props.state.styles.length === tags.length} onChange={(_, c) => props.dispatch({styles: tags.map(v => v.identifier)})}>{t`Select all`}</Checkbox>
                    <Checkbox value="reset" checked={tags.length && !props.state.styles.length} onChange={(_, c) => props.dispatch({styles: []})}>{t`Reset`}</Checkbox>
                    <CheckboxGroup value={props.state.styles} name="styles" onChange={v => {
                            props.dispatch({styles: v})
                        }}>
                            {tags.map(v => <Checkbox key={v._id} value={v.identifier}>{v.name}</Checkbox>)}
                    </CheckboxGroup>
                </Col>
            </Row>
        </FiltersItem>
    )
}

const Location = (props: FiltersItemProps) => {
    return (
        <FiltersItem>
            <Row>
                <Col>
                    <Checkbox value="anywhere" checked={props.state.location === 'anywhere'}>{t`Anywhere in the world`}</Checkbox>
                </Col>
            </Row>
        </FiltersItem>
    )
}

const Deliverability = (props: FiltersItemProps) => {
    return (
        <FiltersItem>
            <Row>
                <Col>
                    <p>
                        <label>{t`Delivery time`}</label>
                        <RadioGroup
                            name="delivery_time"
                            appearance="default"
                            value={props.state.delivery_time}
                            onChange={v => {
                                props.dispatch({delivery_time: v})
                            }}>
                            <Radio value="any">{t`Any`}</Radio>
                            <Radio value="short">{t`Short`}</Radio>
                            <Radio value="medium">{t`Medium`}</Radio>
                            <Radio value="long">{t`Long`}</Radio>
                        </RadioGroup>
                    </p>
                    <p>
                        <label>{t`Can deliver between`}</label>
                        <DateRangePicker block />
                    </p>
                </Col>
            </Row>
        </FiltersItem>
    )
}

const FiltersPanel = () => {

    const router = useRouter()
    const store = useSearchStore()
    const user = useUser()

    const rquery: FilterType = qs.parse(router.query)
    const initial_filters = {
        comm_status: rquery?.comm_status ?? 'any',
        delivery_time: rquery?.delivery_time ?? 'any',
        location: rquery?.location ?? 'anywhere',
        nsfw_level: rquery?.nsfw_level ?? (!_.isEmpty(user) && user.show_nsfw !== NSFW_LEVEL.level_0 ? user.show_nsfw : NSFW_LEVEL.level_0),
        categories: rquery?.categories ?? store.state.categories.map(v => v.identifier),
        styles: rquery?.styles ?? store.state.styles.map(v => v.identifier),
    } 

    const [query_url, set_query_url] = useState(router.asPath)
    const [first, set_first] = useState(true)
    const [dirty, set_dirty] = useState(false)
    const [state, dispatch] = useReducer((old_state: FilterType, new_state: Partial<FilterType>) => {
        return {...old_state, ...new_state}
    }, initial_filters)

    useEffect(() => {
        if (!first) set_dirty(true)
        set_first(false)
        set_query_url(pages.make_search_urlpath(1, store.state.size, {...state}))
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
                            <Dropdown eventKey="category" title={t`Category`} icon={<Icon icon="magic" />}><Category state={state} dispatch={dispatch as any}/></Dropdown>
                            <Dropdown eventKey="style" title={t`Style`} icon={<Icon icon="magic" />}><Style state={state} dispatch={dispatch as any}/></Dropdown>
                            <Dropdown eventKey="price" title={t`Price`} icon={<Icon icon="magic" />}><Price state={state} dispatch={dispatch as any}/></Dropdown>
                            <Dropdown eventKey="deliverability" title={t`Deliverability`} icon={<Icon icon="magic" />}><Deliverability state={state} dispatch={dispatch as any}/></Dropdown>
                            <Dropdown eventKey="location" title={t`Location`} icon={<Icon icon="magic" />}><Location state={state} dispatch={dispatch as any}/></Dropdown>
                            </Nav>
                        </Sidenav.Body>
                        </Sidenav>
                </Row>
                <Row>
                    <Col>
                        <Panel>
                            <p>
                                <label>{t`Show`}</label>
                                <RadioGroup
                                    name="nsfw_levels"
                                    appearance="default"
                                    value={state.nsfw_level}
                                    onChange={v => {
                                        dispatch({nsfw_level: v})
                                    }}>
                                    <Radio value={NSFW_LEVEL.level_0}>{t`Safe`}</Radio>
                                    <Radio value={NSFW_LEVEL.level_5}>{t`Mature`}</Radio>
                                    <Radio value={NSFW_LEVEL.level_10}>{t`Mature & Explicit`}</Radio>
                                </RadioGroup>
                            </p>
                            <p>
                                <label>{t`Commission Status`}</label>
                                <RadioGroup
                                    name="comm_status"
                                    appearance="default"
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
