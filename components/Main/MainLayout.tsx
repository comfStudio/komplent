import Link from 'next/link'
import React from 'react'
import { Layout, Menu, Icon } from 'antd';
import NavMenu from '@components/Header/NavMenu'

const { SubMenu } = Menu;

const { Header, Content, Sider, Footer } = Layout;

interface MainProps {
  title?: string
}

export default class MainLayout extends React.Component<MainProps> {
  public componentDidMount() {
  }

  public componentWillUnmount() {
  }

  public render() {
    return (
      <Layout id="main-layout" className="h-screen">
          <NavMenu/>
          <Layout>
            <Content>
              {this.props.children}
            </Content>
            <Footer className="footer">hej mor</Footer>
          </Layout>
      </Layout>
    )
  }
}
