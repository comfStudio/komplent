import React from 'react'
import { Container as Layout, Header, Content, Footer, Panel, Grid, Row, Col} from 'rsuite';
import NavMenu from '@components/Header/NavMenu'
import classnames from 'classnames'
import { ReactProps, HTMLElementProps } from '@utility/props'

import UserSidebar from '@app/components/App/UserSidebar'
import { useLoginStatus } from '@app/client/hooks/auth';


import './MainLayout.scss'
import { useMount } from 'react-use';
import { is_server } from '@utility/misc';
import { useUser } from '@hooks/user';
import { get_user_room_id } from '@utility/request';

interface Props extends ReactProps {
  activeKey?: string
  pageProps?: object
  noSidebar?: boolean
  header?: React.ReactNode
  paddedTop?: boolean
  noContentMarginTop?: boolean
  noContentPadded?: boolean
}

export const MainLayout = (props: Props) => {
  
    const logged_in = useLoginStatus()
    const user = useUser()

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
      content = <>
      {props.header}
      <Panel bodyFill className={"body-content header" + (props.noContentMarginTop ? " connected" : "")  + (props.noContentPadded ? " no-padding" : "")} bordered>
        {props.children}
      </Panel>
      </>
    } else {
      content = <Panel bodyFill className="body-content" bordered>{props.children}</Panel>
    }

    if (logged_in && !props.noSidebar) {
      layout_content = (
        <Row className="h-full">
          <Col className="sm:hidden md:block h-full" xs={4} lg={4}><UserSidebar activeKey={props.activeKey}/></Col>
          <Col className={"h-full" + (props.paddedTop ? " pt-4" : "")} xs={24} md={20} lg={20}>
          {content}
          </Col>
        </Row>
      )
    } else {
      layout_content = (
        <Row className="h-full">
            <Col className="h-full" xs={24}>{content}</Col>
        </Row>
      )
    }

    return (
      <Layout id="main-layout" className="!h-screen">
        <Header>
          <NavMenu activeKey={props.activeKey}/>
        </Header>
        <Content>
          <Grid className={"h-full"}>
            {layout_content}
          </Grid>
        </Content>
        <Footer className="footer">
          <GridContainer fluid padded className="bg-secondary h-64">
            <Container>
              <Row>
                <Col xs={12}></Col>
              </Row>
            </Container>
          </GridContainer>
        </Footer>
      </Layout>
    )
}

interface CenterPanelProps extends ReactProps, HTMLElementProps {
  borderd?: boolean
  padded?: boolean | number
  title?: string
  subtitle?: string
}

export const CenterPanel = (props: CenterPanelProps) => {
  let cls = "mx-auto text-center"
  if (props.padded) {
    cls += ` py-${typeof props.padded == 'number' ? props.padded : 5}`
  }

  return (
    <Panel bordered={props.borderd} className={classnames(cls)}>
      {props.title && <div className="text-4xl muted">{props.title}</div>}
      {props.children}
      {props.subtitle && <div className="text-3xl muted">{props.subtitle}</div>}
    </Panel>
  )
}

interface ContainerProps extends ReactProps, HTMLElementProps {
  padded?: boolean | number
}

export const Container = (props: ContainerProps) => {
  let cls = "container mx-auto"
  if (props.padded) {
    cls += ` py-${typeof props.padded == 'number' ? props.padded : 5}`
  }
  return (<div className={classnames(cls, props.className)}>
    {props.children}
  </div>)
}

interface PanelContainerProps extends ReactProps, HTMLElementProps {
  flex?: boolean
  bordered?: boolean
  fluid?: boolean
  bodyFill?: boolean
  header?: React.ReactNode
}

export const PanelContainer = (props: PanelContainerProps) => {
  let cls = "panel-container"
  if (props.fluid) {
    cls += props.flex ? " flex flex-grow" : " w-full"
  }

  return (<Panel className={classnames(cls, props.className)} bordered={props.bordered} bodyFill={props.bodyFill} header={props.header}>
    {props.children}
  </Panel>)
}

interface GridContainerProps extends ReactProps, HTMLElementProps {
  fluid?: boolean
  padded?: boolean | number
}

export const GridContainer = (props: GridContainerProps) => {
  let cls = "grid-container"
  if (props.fluid) {
    cls += " !w-full"
  }

  if (props.padded) {
    cls += ` py-${typeof props.padded == 'number' ? props.padded : 5}`
  }

  return (<Grid className={classnames(cls, props.className)} fluid={props.fluid}>
    {props.children}
  </Grid>)
}


export default MainLayout