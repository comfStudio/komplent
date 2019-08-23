import React from 'react'
import { Container as Layout, Header, Content, Footer, Panel} from 'rsuite';
import NavMenu from '@components/Header/NavMenu'
import { ReactProps, HTMLElementProps } from '@utility/props'

import './MainLayout.scss'

interface Props extends ReactProps {
  activeKey?: string
}

export class MainLayout extends React.Component<Props> {
  public componentDidMount() {
  }

  public componentWillUnmount() {
  }

  public render() {
    return (
      <Layout id="main-layout" className="!h-screen">
        <Header>
          <NavMenu activeKey={this.props.activeKey}/>
        </Header>
        <Content>
          {this.props.children}
        </Content>
        <Footer className="footer">
        </Footer>
      </Layout>
    )
  }
}

interface ContainerProps extends ReactProps, HTMLElementProps {
}

export const Container = (props: ContainerProps) => {
  let cls = "container mx-auto"
  return (<div className={props.className ? (props.className + " " + cls) : cls}>
    {props.children}
  </div>)
}

interface PanelContainerProps extends ReactProps, HTMLElementProps {
  flex?: boolean
  bordered?: boolean
  fluid?: boolean
}

export const PanelContainer = (props: PanelContainerProps) => {
  let cls = "panel-container"
  if (props.fluid) {
    cls += props.flex ? " flex flex-grow" : " w-full"
  }

  return (<Panel className={props.className ? (props.className + " " + cls) : cls} bordered={props.bordered}>
    {props.children}
  </Panel>)
}

export default MainLayout