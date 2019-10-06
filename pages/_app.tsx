import App from 'next/app'
import getConfig from 'next/config'
import React from 'react'
import NProgress from 'nprogress'
import Router from 'next/router'
import localForage from 'localforage'

import { Title } from '@components/App'
import { is_server } from '@utility/misc'

import { useUserStore, useTagStore } from '@client/store/user'
import { useCommissionRateStore, useCommissionStore, useCommissionsStore } from '@client/store/commission'

import '@assets/styles/imports.scss'
import '@assets/styles/rsuite.less'
import '@assets/styles/common.scss'
import { ReactProps } from '@utility/props'

// Router.onRouteChangeStart = () => NProgress.start();
// Router.onRouteChangeComplete = () => NProgress.done();
// Router.onRouteChangeError = () => NProgress.done();

const { publicRuntimeConfig, serverRuntimeConfig }= getConfig()

const client_initialize = async () => {
  localForage.config({
    name        : 'komplent',
    version     : 1.0,
    storeName   : 'komplent', // Should be alphanumeric, with underscores.
    description : 'komplent'
});
}

export const StoreProvider = (props: ReactProps) => {
  return (
    <useUserStore.Provider>
      <useCommissionsStore.Provider>
        <useCommissionStore.Provider>
          <useCommissionRateStore.Provider>
            <useTagStore.Provider>
            {props.children}
            </useTagStore.Provider>
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

if (!is_server()) {
  client_initialize()
}

export default KomplentApp