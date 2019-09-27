import React, {useEffect} from 'react'
import Router from 'next/router'

import { MainLayout} from '@components/App/MainLayout'

import useUserStore from '@client/store/user'
import * as pages from '@utility/pages'
import { OptionalAuthPage } from '@components/App/AuthPage';


export const Logout = () => {

  const store = useUserStore()

  useEffect(() => {
    console.log("logging out")
    if (store.state.current_user) {
      store.logout()
    } else {
      Router.replace(pages.home)
    }
  }, [store.state.current_user])

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
