import React, { useState, useEffect } from 'react'
import { Grid, Col, Row, Button } from 'rsuite'

import MainLayout, { GridContainer } from '@components/App/MainLayout'
import CommissionsMenu from '@components/Commissions/CommissionsMenu'
import { ReactProps } from '@app/utility/props'
import { RequireOwnProfile, RequireCreator } from '@components/Profile'
import CommissionsSearch from './CommissionsSearch'
import { useUser } from '@hooks/user'
import { useCommissionsStore } from '@store/commission'
import { useRouter } from 'next/router'
import useUserStore from '@store/user'
import { t } from '@app/utility/lang'

interface Props extends ReactProps {
    activeKey?: 'commissions' | 'requests'
}

const CommissionsLayout = (props: Props) => {

    const router = useRouter()
    const user_store = useUserStore()
    const store = useCommissionsStore()


    const [loading, set_loading] = useState(false)
    const [page, set_page] = useState(0)

    useEffect(() => {
        set_page(0)
    }, [router.query])

    return (
        <MainLayout
            activeKey="commissions"
            paddedTop
            header={<CommissionsMenu activeKey={props.activeKey} />}>
            <GridContainer fluid>
                <Row>
                    <Col>
                        <CommissionsSearch/>
                    </Col>
                </Row>
                <hr className="small invisible" />
                <Row>
                    <Col xs={24}>{props.children}</Col>
                </Row>
                <Row>
                <div className="text-center w-full my-2"><Button loading={loading} appearance="subtle" onClick={ev => {
                    ev.preventDefault();
                    const next_page = page + 1
                    set_page(next_page)
                    set_loading(true)

                    store.query_commissions(props.activeKey, user_store.state.current_user, user_store.state.is_creator, router.query, next_page).then(r => {
                        store.setState({commissions: [...store.state.commissions, ...r]})
                        set_loading(false)
                    })

                    }}>{t`Load more`}</Button></div>
                </Row>
            </GridContainer>
        </MainLayout>
    )
}

export default CommissionsLayout
