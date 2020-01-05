import React from 'react'

import { Grid, Col, Row } from 'rsuite'

import ResultLayout from '@components/Search/ResultLayout'
import { useFollowStore } from '@store/follow'
import { HTMLElementProps } from '@utility/props'

export const FollowLayout = (props: {UserComponent: React.ElementType, userComponentProps?: object} & HTMLElementProps) => {

    const store = useFollowStore()

    return (
        <Grid fluid className="p-5 h-full">
            {props.children}
            <Row className="h-full">
                <Col className="h-full" xs={24}>
                    <ResultLayout UserComponent={props.UserComponent} userComponentProps={props.userComponentProps} size={store.state.size} count={store.state.count} page={store.state.page} items={store.state.items} />
                </Col>
            </Row>
        </Grid>
    )
}

export default FollowLayout
