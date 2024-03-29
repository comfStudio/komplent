import React, { memo } from 'react'
import {
    Container as Layout,
    Header,
    Content,
    Footer as FooterLayout,
    Panel,
    Grid,
    Row,
    Col,
} from 'rsuite'
import NavMenu from '@components/Header/NavMenu'
import classnames from 'classnames'
import { ReactProps, HTMLElementProps } from '@utility/props'

import UserSidebar from '@app/components/App/UserSidebar'
import { useLoginStatus } from '@app/client/hooks/auth'

import './MainLayout.scss'
import { useMount } from 'react-use'
import { is_server } from '@utility/misc'
import { useUser } from '@hooks/user'
import { get_user_room_id } from '@utility/request'
import MatureContent from './MatureContent'
import Footer from './Footer'
import VerifyEmailPanel from '@components/User/VerifyEmail'

export interface MainLayoutProps extends ReactProps {
    activeKey?: string
    pageProps?: object
    noSidebar?: boolean
    noContainer?: boolean
    noPanel?: boolean
    header?: React.ReactNode
    paddedTop?: boolean
    noContentMarginTop?: boolean
    noContentPadded?: boolean
}

export const MainLayout = memo(function MainLayout(props: MainLayoutProps) {
    const logged_in = useLoginStatus()
    const user = useUser()
    const email_verified = user ? user.email_verified : true

    useMount(() => {
        if (!is_server()) {
            // if (user) {
            //   global.user_room = global.primus.room(get_user_room_id(user))
            // }
        }
    })

    let layout_content = null
    let content
    if (props.header) {
        content = (
            <>
                {props.header}
                {props.noPanel && props.children}
                {!props.noPanel &&
                    <Panel
                    bodyFill
                    className={
                        'body-content header' +
                        (props.noContentMarginTop ? ' connected' : '') +
                        (props.noContentPadded ? ' no-padding' : '')
                    }
                    >
                        {props.children}
                    </Panel>
                }
            </>
        )
    } else {
        content = props.noPanel ? props.children
            : (
            <Panel bodyFill className="body-content">
                {props.children}
            </Panel>
        )
    }

    if (logged_in && !props.noSidebar) {
        layout_content = (
            <Row className="h-full !m-0">
                <Col className="bs:hidden lg:block h-full" xs={4} lg={4}>
                    <UserSidebar activeKey={props.activeKey} />
                </Col>
                <Col
                    className={'h-full' + (props.paddedTop ? ' pt-4' : '')}
                    xs={24}
                    md={20}
                    lg={20}>
                    {content}
                </Col>
            </Row>
        )
    } else {
        layout_content = (
            <Row className="h-full !m-0">
                <Col className="h-full !p-0" xs={24}>
                    {content}
                </Col>
            </Row>
        )
    }

    return (
        <Layout id="main-layout">
            <Header className="header">
                <NavMenu activeKey={props.activeKey} />
            </Header>
            <Content className="content">
                {!email_verified && <VerifyEmailPanel bordered className="container mx-auto w-256 mt-4 mb-2"/>}
                {props.noContainer && <Grid fluid className={'h-full !p-0'}>{layout_content}</Grid>}
                {!props.noContainer && <PageContainer><Grid fluid className={'h-full !p-0'}>{layout_content}</Grid></PageContainer>}
            </Content>
            <FooterLayout className="footer bg-secondary h-64 ">
                <GridContainer fluid padded className="px-5">
                    <Footer/>
                </GridContainer>
            </FooterLayout>
        </Layout>
    )
})

export interface CenterPanelProps extends ReactProps, HTMLElementProps {
    bordered?: boolean
    padded?: boolean | number
    title?: string
    subtitle?: string
}

export const CenterPanel = memo(function CenterPanel(props: CenterPanelProps) {
    let cls = 'mx-auto text-center'
    if (props.padded) {
        cls += ` py-${typeof props.padded == 'number' ? props.padded : 5}`
    }

    return (
        <Panel bordered={props.bordered} className={classnames(cls)}>
            {props.title && <div className="text-4xl muted">{props.title}</div>}
            {props.children}
            {props.subtitle && (
                <div className="text-3xl muted">{props.subtitle}</div>
            )}
        </Panel>
    )
})

interface ContainerProps extends ReactProps, HTMLElementProps {
    padded?: boolean | number
}

export const Container = memo(function Container(props: ContainerProps) {
    let cls = 'container mx-auto'
    if (props.padded) {
        cls += ` py-${typeof props.padded == 'number' ? props.padded : 5}`
    }
    return (
        <div className={classnames(cls, props.className)}>{props.children}</div>
    )
})

export const PageContainer = memo(function PageContainer(props: ContainerProps) {
    let cls = 'container mx-auto'
    if (props.padded) {
        cls += ` py-${typeof props.padded == 'number' ? props.padded : 5}`
    }
    return (
        <div className={classnames(cls, props.className)}>{props.children}</div>
    )
})

interface PanelContainerProps extends ReactProps, HTMLElementProps {
    flex?: boolean
    bordered?: boolean
    fluid?: boolean
    bodyFill?: boolean
    header?: React.ReactNode
}

export const PanelContainer = memo(function PanelContainer(props: PanelContainerProps) {
    let cls = 'panel-container'
    if (props.fluid) {
        cls += props.flex ? ' flex flex-grow' : ' w-full'
    }

    return (
        <Panel
            className={classnames(cls, props.className)}
            bordered={props.bordered}
            bodyFill={props.bodyFill}
            header={props.header}>
            {props.children}
        </Panel>
    )
})

interface GridContainerProps extends ContainerProps {
    fluid?: boolean
    padded?: boolean | number
}

export const GridContainer = memo(function GridContainer(props: GridContainerProps) {
    let cls = 'grid-container'
    if (props.fluid) {
        cls += ' !w-full'
    }

    return (
        <Container {...props}>
            <Grid className={classnames(cls, props.className)} fluid={props.fluid}>
                {props.children}
            </Grid>
        </Container>
    )
})

export default MainLayout
