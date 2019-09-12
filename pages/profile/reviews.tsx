import React from 'react'

import AuthPage from '@components/App/AuthPage'
import { ProfileLayout } from '@components/Profile'
import { Grid, Row } from 'rsuite';


class ReviewsPage extends AuthPage {
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
