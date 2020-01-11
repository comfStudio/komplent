import React from 'react'
import { useRouter } from 'next/router'
import { Grid, Col, Row } from 'rsuite'

import ResultLayout from '@components/Search/ResultLayout'
import { useFollowStore } from '@store/follow'
import { HTMLElementProps } from '@utility/props'
import Empty, { EmptyPanel } from '@components/App/Empty'
import { t } from '@app/utility/lang'
import * as pages from '@utility/pages'

export const FollowLayout = (props: {url:string, UserComponent: React.ElementType, userComponentProps?: object} & HTMLElementProps) => {
    const router = useRouter()

    const store = useFollowStore()

    const on_page = p => router.push(pages.make_follow_urlpath(props.url, p, store.state.size, router.query))

    return (
        <Grid fluid className="p-5 h-full">
            {props.children}
            <Row className="h-full">
                <Col className="h-full" xs={24}>
                    <ResultLayout on_page={on_page} UserComponent={props.UserComponent} userComponentProps={props.userComponentProps} size={store.state.size} count={store.state.count} page={store.state.page} items={store.state.items}>
                        {!store.state.items || !store.state.items.length && <EmptyPanel type="following" subtitle={t``}/>}
                    </ResultLayout>
                </Col>
            </Row>
        </Grid>
    )
}

export default FollowLayout
