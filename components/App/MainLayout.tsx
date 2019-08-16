import Link from 'next/link'
import React from 'react'
import { Layout, Menu, Icon, Empty } from 'antd';
import NavMenu from '@components/Header/NavMenu'
import { ReactProps, HTMLElementProps } from '@utility/props'

const { SubMenu } = Menu;

const { Header, Content, Sider, Footer } = Layout;

interface Props extends ReactProps {
  selectedKeys?: string[]
}

export class MainLayout extends React.Component<Props> {
  public componentDidMount() {
  }

  public componentWillUnmount() {
  }

  public render() {
    return (
      <Layout id="main-layout" className="!h-screen">
          <NavMenu selectedKeys={this.props.selectedKeys}/>
          <Layout>
            <Content>
              {this.props.children}
            </Content>
            <Footer className="footer"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/></Footer>
          </Layout>
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

export default MainLayout