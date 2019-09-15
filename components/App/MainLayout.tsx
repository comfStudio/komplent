import React from 'react'
import { Container as Layout, Header, Content, Footer, Panel, Grid, Row, Col} from 'rsuite';
import NavMenu from '@components/Header/NavMenu'
import { ReactProps, HTMLElementProps } from '@utility/props'

import UserSidebar from '@app/components/App/UserSidebar'
import { useLoginStatus } from '@app/client/hooks/auth';
import UserTypeModal from '@components/User/UserTypeModal'


import './MainLayout.scss'

interface Props extends ReactProps {
  activeKey?: string
  pageProps?: object
  noSidebar?: boolean
}

export const MainLayout = (props: Props) => {

    const logged_in = useLoginStatus()

    let content = null

    if (logged_in && !props.noSidebar) {
      content = (
        <Row>
          <Col className="animate-width" xs={4} lg={4}><UserSidebar activeKey={props.activeKey}/></Col>
          <Col className="animate-width" xs={20} lg={20}>{props.children}</Col>
        </Row>
      )
    } else {
      content = (
        <Row>
            <Col className="animate-width" xs={24}>{props.children}</Col>
        </Row>
      )
    }

    return (
      <Layout id="main-layout" className="!h-screen">
        <Header>
          <NavMenu activeKey={props.activeKey}/>
        </Header>
        <Content>
          <Grid>
            {!!logged_in && <UserTypeModal/>}
            {content}
          </Grid>
        </Content>
        <Footer className="footer">
        </Footer>
      </Layout>
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
  return (<div className={props.className ? (props.className + " " + cls) : cls}>
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

  return (<Panel className={props.className ? (props.className + " " + cls) : cls} bordered={props.bordered} bodyFill={props.bodyFill} header={props.header}>
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

  return (<Grid className={props.className ? (props.className + " " + cls) : cls} {...props}>
    {props.children}
  </Grid>)
}


export default MainLayout