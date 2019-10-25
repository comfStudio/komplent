import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout } from '@components/Profile'
import { Grid, Row, Col } from 'rsuite';

import UserCard from '@components/User/UserCard';

class RecommendationsPage extends ProfilePage {
    public render() {
      return this.renderPage(
        <ProfileLayout activeKey="recommendations">
             <Grid fluid>
                    <Row>
                        {/* <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col>
                        <Col xs={12}><UserCard/></Col> */}
                    </Row>
                </Grid>
        </ProfileLayout>
      )
    }
  }

export default RecommendationsPage
