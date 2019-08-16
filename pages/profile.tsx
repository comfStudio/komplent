import React from 'react'
import { Layout, Empty } from 'antd';

import { MainLayout, Container } from '@components/App/MainLayout'
import { ProfileHeader } from '@components/Profile/ProfileHeader'
import ProfileMenu from '@components/Profile/ProfileMenu'
import ProfileInfo from '@components/Profile/ProfileInfo'


class ProfilePage extends React.Component {
  public render() {
    return (
      <MainLayout selectedKeys={["profile"]}>
        <Layout>
          <ProfileHeader></ProfileHeader>
        </Layout>
        <ProfileMenu/>
        <Container>
          <ProfileInfo/>
        </Container>
      </MainLayout>
    )
  }
}

export default ProfilePage
