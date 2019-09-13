import App from 'next/app'
import getConfig from 'next/config'
import React from 'react'
import NProgress from 'nprogress'
import Router from 'next/router'

import { Title } from '@components/App'
import { connect } from '@server/db'
import { is_server } from '@utility/misc'

import '@assets/styles/rsuite.less'
import '@assets/styles/imports.scss'
import '@assets/styles/common.scss'

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const { publicRuntimeConfig, serverRuntimeConfig }= getConfig()

const server_initialize = () => {
  connect()
}

class KomplentApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <React.Fragment>
        <Title>Komplent</Title>
        <Component {...pageProps} />
      </React.Fragment>
    )
  }
}

if (process.env.SERVER_BUILD && is_server()) {
  server_initialize()
}

export default KomplentApp
