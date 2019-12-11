import React from 'react'

import { Grid, Col, Row } from 'rsuite'

import FiltersPanel from '@components/Search/FiltersPanel'
import ResultLayout from '@components/Search/ResultLayout'
import RecommendPanel from '@components/Search/RecommendPanel'

export const SearchLayout = () => {
    return (
        <Grid fluid className="p-5 h-full">
            <Row className="h-full">
                <Col xs={6}>
                    <FiltersPanel />
                </Col>
                <Col className="h-full" xs={18}>
                    <ResultLayout />
                </Col>
            </Row>
        </Grid>
    )
}

export default SearchLayout
