import React from 'react'

import { ProfileLayout } from '@components/Profile'
import { Grid, Row, Col } from 'rsuite';

import UserCard from '@app/components/User/UserCard';

export const ReviewsPage = (props) => {

    return (
        <ProfileLayout activeKey="reviews">
             <Grid fluid>
                    <Row>
                    </Row>
                </Grid>
        </ProfileLayout>
    )
}

export default ReviewsPage
