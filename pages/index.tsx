import React from 'react'

import { Grid, Row, Col, Button, Carousel } from 'rsuite'
import Link from 'next/link'

import MainLayout from '@components/App/MainLayout'
import { t } from '@app/utility/lang'
import * as pages from '@utility/pages'
import Empty from '@components/App/Empty'

const IndexPage = () => {
    return (
        <MainLayout noSidebar noPanel noContentMarginTop noContentPadded noContainer>
            <Grid fluid className="!p-0">
                <Row className="!m-0 h-64 bg-white p-5 text-center">
                    <Col xs={24}>
                        <h1 className="text-center text-primary">{t`The Commission Platform for`} <br/> {t`Artists & Creators`}</h1>
                    </Col>
                    <Col xs={24}>
                        <Link href={pages.join_as_creator} passHref>
                            <Button appearance="primary" size="lg" componentClass="a">{t`Start creating`}</Button>
                        </Link>
                    </Col>
                </Row>
                <hr/>
                <Row className="!m-0">
                    <Col xs={24} className="!p-0 m<">
                        <Empty type="making_art"/>
                    </Col>
                </Row>
            </Grid>
        </MainLayout>
    )
}

export default IndexPage
