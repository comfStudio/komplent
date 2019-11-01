import React from 'react'

import { AuthPage } from '@components/App/AuthPage'
import SettingsLayout from '@components/Settings'
import UserSettings from '@components/Settings/UserSettings'


class SettingsPage extends AuthPage {

  public render() {
    return this.renderPage(
      <SettingsLayout activeKey="user">
        <UserSettings/>
      </SettingsLayout>
    )
  }
}

export default SettingsPage
