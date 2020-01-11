import React from 'react'

import { Grid, Col, Row, Panel, Pagination, FlexboxGrid } from 'rsuite'
import { useRouter } from 'next/router'

import CreatorCard from '@components/User/CreatorCard'
import * as pages from '@utility/pages'

export const ResultLayout = ({UserComponent = CreatorCard, userComponentProps = undefined, ...props}: { on_page?: Function, children?: any, size: number, count: number, page: number, items: any[], UserComponent: React.ElementType, userComponentProps?: object}) => {
    const router = useRouter()

    const page_count = Math.floor(props.count / props.size)
    const current_page = props.page

    const on_page = props.on_page ?? (p => router.push(pages.make_search_urlpath(p, props.size, router.query)))

    return (
        <Panel className="h-full">
            <Grid fluid className="h-full">
                {!!props.items.length && 
                <Row className="text-center">
                    <Pagination
                        onSelect={on_page}
                        pages={page_count || 1}
                        activePage={current_page || 1}
                        last
                        first
                        next
                        prev
                        ellipsis
                    />
                </Row>}
                <Row>
                    <Col xs={24}>
                        <FlexboxGrid>
                            {props.items.map(u => {
                                return (
                                    <FlexboxGrid.Item key={u._id} componentClass={Col} colspan={6} md={8}>
                                        <UserComponent data={u} {...userComponentProps} />
                                    </FlexboxGrid.Item>
                                )
                            })}
                            {props.children}
                        </FlexboxGrid>
                    </Col>
                </Row>
                {!!props.items.length && 
                <Row className="text-center">
                    <Pagination
                        onSelect={on_page}
                        pages={page_count || 1}
                        activePage={current_page || 1}
                        last
                        first
                        next
                        prev
                        ellipsis
                    />
                </Row>}
            </Grid>
        </Panel>
    )
}

export default ResultLayout
