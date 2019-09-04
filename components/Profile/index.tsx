import React from 'react';

import { Panel } from 'rsuite'

import { MainLayout, Container, PanelContainer } from '@components/App/MainLayout'
import { ProfileHeader } from '@components/Profile/ProfileHeader'
import { ProfileMenu, Props as MenuProps } from '@components/Profile/ProfileMenu'
import ProfileInfo from '@components/Profile/ProfileInfo'

import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props'

interface LayoutProps extends ReactProps, MenuProps {
  activeKey?: string
}

export const ProfileLayout = (props: LayoutProps) => {
    return (
        <MainLayout activeKey="profile">
          <ProfileHeader></ProfileHeader>
        <ProfileMenu {... props}/>
        <Container>
          <ProfileInfo className="float-right"/>
          <PanelContainer bordered fluid flex>
            { props.children }
          </PanelContainer>
        </Container>
      </MainLayout>
    )
}

export const ProfileNameTag = (props) => {
  return (<h3 className="profile-name text-center">~A little twiddly~</h3>)
}