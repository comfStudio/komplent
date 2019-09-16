import React, {useEffect} from 'react'
import Router from 'next/router'

import { MainLayout} from '@components/App/MainLayout'

import useUserStore from '@store/user'
import * as pages from '@utility/pages'
import { OptionalAuthPage } from '@components/App/AuthPage';


export const Logout = () => {

  const [ user_state, user_actions ] = useUserStore()

  useEffect(() => {
    console.log("logging out")
    if (user_state.current_user) {
      user_actions.logout()
    } else {
      Router.replace(pages.home)
    }
  }, [user_state.current_user])

  return null
}

class LogoutPage extends OptionalAuthPage {

  render() {
    return this.renderPage(
      <MainLayout noSidebar activeKey="logout">
        <Logout/>
      </MainLayout>
    )
  }
}

export default LogoutPage
