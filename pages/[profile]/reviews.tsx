import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout } from '@components/Profile'
import { Grid, Row } from 'rsuite';


class ReviewsPage extends ProfilePage {
    public render() {
      return this.renderPage(
        <ProfileLayout activeKey="reviews">
             <Grid fluid>
                    <Row>
                    </Row>
                </Grid>
        </ProfileLayout>
      )
    }
  }

export default ReviewsPage
