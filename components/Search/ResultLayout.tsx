import React from 'react'

import { Grid, Col, Row, Panel, Pagination, FlexboxGrid } from 'rsuite'
import { useRouter } from 'next/router'

import CreatorCard from '@components/User/CreatorCard'
import useSearchStore from '@store/search'
import * as pages from '@utility/pages'

export const ResultLayout = () => {
    const router = useRouter()
    const store = useSearchStore()

    const page_count = Math.floor(store.state.count / store.state.size)
    const current_page = store.state.page

    const on_page = p => router.push(pages.make_search_urlpath(p, store.state.size, router.query))

    return (
        <Panel className="h-full">
            <Grid fluid className="h-full">
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
                </Row>
                <Row>
                    <Col xs={24}>
                        <FlexboxGrid>
                            {store.state.items.map(u => {
                                return (
                                    <FlexboxGrid.Item key={u._id} componentClass={Col} colspan={6} md={8}>
                                        <CreatorCard data={u} />
                                    </FlexboxGrid.Item>
                                )
                            })}
                        </FlexboxGrid>
                    </Col>
                </Row>
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
                </Row>
            </Grid>
        </Panel>
    )
}

export default ResultLayout
