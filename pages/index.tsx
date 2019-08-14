import React from 'react'
import { Layout, Empty } from 'antd';

import MainLayout from '@components/App/MainLayout'


class IndexPage extends React.Component {
  public render() {
    return (
      <MainLayout>
        <Layout><Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/></Layout>
        <Layout><Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/></Layout>
      </MainLayout>
    )
  }
}

export default IndexPage
