import React from 'react';
import { Row, Col, Panel } from 'rsuite';

import { Image } from '@components/App/Image'
import { GridContainer } from '@components/App/MainLayout'
import { HTMLElementProps } from '@app/utility/props';

const Gallery = (props) => {
    return (
        <Panel bordered bodyFill>
            <Image placeholderText="3" w={250} h={200}/>
        </Panel>
    )
}


interface Props extends HTMLElementProps {
    fluid?: boolean
}

export const ProfileGallery = (props: Props) => {
    return (
        <GridContainer fluid={props.fluid}>
            <Row gutter={30}>
                <Col xs={6}><Gallery/></Col>
                <Col xs={6}><Gallery/></Col>
                <Col xs={6}><Gallery/></Col>
                <Col xs={6}><Gallery/></Col>
            </Row>
        </GridContainer>
    )
}

export default ProfileGallery
