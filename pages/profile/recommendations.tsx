import React from 'react'

import { ProfileLayout } from '@components/Profile'
import { Grid, Row, Col } from 'rsuite';

import UserCard from '@app/components/User/UserCard';

export const RecommendationsPage = (props) => {

    return (
        <ProfileLayout activeKey="recommendations">
             <Grid fluid>
                    <Row>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                    </Row>
                </Grid>
        </ProfileLayout>
    )
}

export default RecommendationsPage
