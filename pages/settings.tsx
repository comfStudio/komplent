import React from 'react'

import { AuthPage } from '@components/App/AuthPage'
import SettingsLayout from '@components/Settings'


class SettingsPage extends AuthPage {
  public render() {
    return this.renderPage(
      <SettingsLayout/>
    )
  }
}

export default SettingsPage
