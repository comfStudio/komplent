import App from 'next/app'
import getConfig from 'next/config'
import React from 'react'
import NProgress from 'nprogress'
import Router from 'next/router'
import localForage from 'localforage'

import { Title } from '@components/App'
import { connect } from '@server/db'
import { is_server } from '@utility/misc'

import { useUserStore } from '@client/store/user'
import { useCommissionRateStore, useCommissionStore, useCommissionsStore } from '@client/store/commission'

import '@assets/styles/imports.scss'
import '@assets/styles/rsuite.less'
import '@assets/styles/common.scss'
import { ReactProps } from '@utility/props'

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const { publicRuntimeConfig, serverRuntimeConfig }= getConfig()

const client_initialize = async () => {
  localForage.config({
    name        : 'komplent',
    version     : 1.0,
    storeName   : 'komplent', // Should be alphanumeric, with underscores.
    description : 'komplent'
});
}

const server_initialize = async () => {
  await connect()
}

export const StoreProvider = (props: ReactProps) => {
  return (
    <useUserStore.Provider>
      <useCommissionsStore.Provider>
        <useCommissionStore.Provider>
          <useCommissionRateStore.Provider>
            {props.children}
          </useCommissionRateStore.Provider>
        </useCommissionStore.Provider>
      </useCommissionsStore.Provider>
    </useUserStore.Provider>
  )
}

class KomplentApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <React.Fragment>
        <Title>Komplent</Title>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </React.Fragment>
    )
  }
}

if (process.env.SERVER_BUILD && is_server()) {
  server_initialize()
}

if (!is_server()) {
  client_initialize()
}

export default KomplentApp
