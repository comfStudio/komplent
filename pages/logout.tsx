import React from 'react'
import { useMount } from 'react-use'

import { MainLayout} from '@components/App/MainLayout'

import { AuthPage } from '@components/App/AuthPage'
import useUserStore from '@store/user'

const Logout = () => {
  const [user_store, user_actions] = useUserStore()
  useMount(async () => {
    await user_actions.logout()
  })
  return null
}

class LogoutPage extends AuthPage {
  public render() {
    return this.renderPage(
      <MainLayout noSidebar activeKey="logout">
        <Logout/>
      </MainLayout>
    )
  }
}

export default LogoutPage
