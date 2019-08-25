import React from 'react'
import { Container as Layout, Header, Content, Footer, Panel, Grid} from 'rsuite';
import NavMenu from '@components/Header/NavMenu'
import { ReactProps, HTMLElementProps } from '@utility/props'

import './MainLayout.scss'
import { number } from 'prop-types';

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

interface GridContainerProps extends ReactProps, HTMLElementProps {
  fluid?: boolean
}

export const GridContainer = (props: GridContainerProps) => {
  let cls = "grid-container"
  if (props.fluid) {
    cls += " !w-full"
  }

  return (<Grid className={props.className ? (props.className + " " + cls) : cls} {...props}>
    {props.children}
  </Grid>)
}


export default MainLayout