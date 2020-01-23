import React, { memo } from 'react'
import { Grid, Col, Row } from 'rsuite'

import MainLayout, { GridContainer } from '@components/App/MainLayout'
import DashboardMenu from '@components/Dashboard/DashboardMenu'
import { ReactProps } from '@app/utility/props'
import FollowingsList from './FollowingsList'
import { useLoginStatus } from '@hooks/auth'
import UserTypeModal from '@components/User/UserTypeModal'

interface Props extends ReactProps {
    activeKey?: string
    pageProps?: object
}

const DashboardLayout = memo(function DashboardLayout(props: Props) {
    const logged_in = useLoginStatus()

    return (
        <MainLayout
            paddedTop
            activeKey="dashboard"
            {...props.pageProps}
            header={<DashboardMenu activeKey={props.activeKey} />}>
            <GridContainer fluid>
                <Row>
                    <Col xs={24}>
                        {props.children}
                    </Col>
                </Row>
            </GridContainer>
        </MainLayout>
    )
})

export default DashboardLayout
