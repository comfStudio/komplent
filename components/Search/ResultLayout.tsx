import React from 'react';

import { Grid, Col, Row, Panel, Pagination } from 'rsuite'

import UserCard from '@app/components/User/UserCard'
import useSearchStore from '@store/search';

export const ResultLayout = () => {

    const store = useSearchStore()

    return (
        <Panel bordered className="h-full">
            <Grid fluid className="h-full">
                <Row className="text-center"><Pagination pages={10} activePage={1} last first next prev /></Row>
                <Row>
                    {
                        store.state.results.map(u => {
                            return (
                                <Col key={u._id} xs={12}><UserCard data={u}/></Col>
                            )
                        })
                    }
                </Row>
                <Row className="text-center"><Pagination pages={10} activePage={1} last first next prev /></Row>
            </Grid>
        </Panel>
    );
}

export default ResultLayout;