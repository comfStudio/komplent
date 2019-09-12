import React from 'react'

import { AuthPage } from '@components/App/AuthPage'
import MainLayout from '@app/components/App/MainLayout'


class SettingsPage extends AuthPage {
  public render() {
    return this.renderPage(
      <MainLayout activeKey="settings">
      </MainLayout>
    )
  }
}

export default SettingsPage
