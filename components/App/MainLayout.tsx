import React from 'react'
import { Container as Layout, Header, Content, Footer} from 'rsuite';
import NavMenu from '@components/Header/NavMenu'
import { ReactProps, HTMLElementProps } from '@utility/props'

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
        <Header>
          <NavMenu selectedKeys={this.props.selectedKeys}/>
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

export default MainLayout