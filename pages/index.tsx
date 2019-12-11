import React from 'react'

import { Grid, Row, Col, Button, Carousel } from 'rsuite'
import Link from 'next/link'

import MainLayout from '@components/App/MainLayout'
import { t } from '@app/utility/lang'
import * as pages from '@utility/pages'

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
                {/* <Row className="!m-0">
                    <Col xs={24} className="!p-0">
                    <Carousel autoplay placement="bottom" shape="bar">
                        <img
                        src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=1"
                        height="250"
                        />
                        <img
                        src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=2"
                        height="250"
                        />
                        <img
                        src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=3"
                        height="250"
                        />
                        <img
                        src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=4"
                        height="250"
                        />
                        <img
                        src="https://via.placeholder.com/600x250/8f8e94/FFFFFF?text=5"
                        height="250"
                        />
                    </Carousel>
                    </Col>
                </Row> */}
            </Grid>
        </MainLayout>
    )
}

export default IndexPage
