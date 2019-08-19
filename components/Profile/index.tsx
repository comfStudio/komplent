import React from 'react';

import { Card, Layout } from 'rsuite'

import { MainLayout, Container } from '@components/App/MainLayout'
import { ProfileHeader } from '@components/Profile/ProfileHeader'
import { ProfileMenu, Props as MenuProps } from '@components/Profile/ProfileMenu'
import ProfileInfo from '@components/Profile/ProfileInfo'

import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props'

interface LayoutProps extends ReactProps, MenuProps {

}

export const ProfileLayout = (props: LayoutProps) => {
    return (
        <MainLayout selectedKeys={["profile"]}>
        <Layout>
          <ProfileHeader></ProfileHeader>
        </Layout>
        <ProfileMenu {... props}/>
        <Container>
          <ProfileInfo className="float-right"/>
          <Card className="flex flex-grow">
            { props.children }
          </Card>
        </Container>
      </MainLayout>
    )
}