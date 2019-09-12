import React from 'react'

import AuthPage from '@components/App/AuthPage'
import { ProfileLayout } from '@components/Profile'
import { Grid, Row, Col } from 'rsuite';

import UserCard from '@app/components/User/UserCard';

class RecommendationsPage extends AuthPage {
    public render() {
      return this.renderPage(
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
  }

export default RecommendationsPage
