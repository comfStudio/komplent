import React, { useEffect } from 'react';
import Router from 'next/router'

import { MainLayout, Container, PanelContainer } from '@components/App/MainLayout'
import { ProfileHeader } from '@components/Profile/ProfileHeader'
import { ProfileMenu, Props as MenuProps } from '@components/Profile/ProfileMenu'
import ProfileInfo from '@components/Profile/ProfileInfo'
import { useProfileUser, useUser } from '@hooks/user'
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

interface ProfileNameTagProps {
  name: string
}

export const ProfileNameTag = (props: ProfileNameTagProps) => {
  return (<h3 className="profile-name text-center">{props.name}</h3>)
}

export const RequireOwnProfile = () => {
  const { own_profile, context : { profile_path } } = useProfileUser()

  useEffect(() => {
    if (!own_profile) {
      Router.replace(profile_path)
    }
  }, [own_profile])

  return null
}