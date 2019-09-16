import React from 'react'

import { InverseAuthPage } from '@components/App/AuthPage'
import LoginPage from '@components/App/LoginPage';
import { LoginContext } from '@client/context'

class Page extends InverseAuthPage {

  render() {
    console.log("login page")
    return this.renderPage(
      <LoginContext.Provider value={{next_page: true}}>
        <LoginPage/>
      </LoginContext.Provider>
    )
  }
}

export default Page
