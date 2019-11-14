import React, { useEffect, useState, useLayoutEffect } from 'react';
import Router from 'next/router'
import { Grid, Row, Col, Icon, IconButton } from 'rsuite';

import { MainLayout, Container, PanelContainer } from '@components/App/MainLayout'
import { ProfileHeader } from '@components/Profile/ProfileHeader'
import { ProfileMenu, Props as MenuProps } from '@components/Profile/ProfileMenu'
import ProfileInfo from '@components/Profile/ProfileInfo'
import { useProfileUser, useUser } from '@hooks/user'
import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props'
import { useUpdateDatabase } from '@hooks/db';
import { follow_schema } from '@schema/user'
import { post_task, TaskMethods, post_task_debounce } from '@client/task';
import { TASK, Guideline, GuidelineType, guideline_types } from '@server/constants';
import { dashboard } from '@utility/pages';

interface LayoutProps extends ReactProps, MenuProps {
  activeKey?: string
}

export const ProfileLayout = (props: LayoutProps) => {
    return (
        <MainLayout activeKey="profile" noContentMarginTop noContentPadded header={
          <>
          <ProfileHeader></ProfileHeader>
          <ProfileMenu {... props}/>
          </>
        }>
        <ProfileInfo className="float-right"/>
        <PanelContainer fluid flex>
          { props.children }
        </PanelContainer>
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
  const { context : { profile_path, profile_owner } } = useProfileUser()

  useLayoutEffect(() => {
    if (!profile_owner) {
      Router.replace(profile_path)
    }
  }, [profile_owner])

  return null
}

export const RequireCreator = () => {
  const user = useUser()

  useLayoutEffect(() => {
    if (user && user.type !== 'creator') {
      Router.replace(dashboard)
    }
  }, [user])

  return null
}

export const RequireOwnProfileInverse = () => {
  const { context : { profile_path, profile_owner } } = useProfileUser()

  useLayoutEffect(() => {
    if (profile_owner) {
      Router.replace(profile_path)
    }
  }, [profile_owner])

  return null
}

export const FollowButton = () => {

  const { current_user, profile_user, context: { follow } } = useProfileUser()
  const [follow_obj, set_follow_obj] = useState(follow)
  const [loading, set_loading] = useState(false)
  const update = useUpdateDatabase()

  return (
      <IconButton loading={loading} icon={<Icon icon="bell"/>} appearance="default" color={follow_obj ? "blue" : undefined} size="lg" className="mx-3"
      onClick={(ev) => {
        ev.preventDefault()
        set_loading(true)
        if (follow_obj) {
          update("Follow", {...follow_obj, end: new Date()}, follow_schema, true).then((r) => {
            if (r.status) {
              set_follow_obj(null)
            }
            set_loading(false)
          })
        } else {
          update("Follow", {follower: current_user._id, followee: profile_user._id}, follow_schema, true, true).then((r) => {
            if (r.status) {
              set_follow_obj(r.body)
              post_task(TaskMethods.schedule_unique, {key:current_user._id, when: "30 seconds", task: TASK.followed_user, data: {user_id: current_user._id, followee:profile_user._id}})
            }
            set_loading(false)
          })
        }
      }}>
      {follow_obj ? t`Following` : t`Follow`}
      </IconButton>
  )
}

export const GuidelineList = () => {

  const { profile_user } = useProfileUser()

  const guidelines = profile_user?.commission_guidelines ?? []

  if (!guidelines.length) {
    return null
  }

  const titles = (v: Guideline) => {switch(v){
      case GuidelineType.will_draw: return t`Will draw`
      case GuidelineType.will_not_draw: return t`Will not draw`
  }}

  const icons = (v: Guideline) => {switch(v){
    case GuidelineType.will_draw: return {name: 'check', color: 'text-green-500'}
    case GuidelineType.will_not_draw: return {name: 'close', color: 'text-red-500'}
}}

  return (
    <Grid fluid>
      <Row>
        {guideline_types.map(gtype => 
        <Col key={gtype} xs={Math.floor(24/guideline_types.length)}>
          <h4 className="text-center">{titles(gtype)}</h4>
          <ul className="px-10">
            {guidelines.filter(v => v.guideline_type === gtype).map(({guideline_type, value}, idx) => <li key={idx.toString() + value}><Icon icon={icons(guideline_type).name as any} className={`mr-2 ${icons(guideline_type).color}`} />{value}</li>)}
          </ul>
        </Col>
        )}
      </Row>
    </Grid>
  )
}