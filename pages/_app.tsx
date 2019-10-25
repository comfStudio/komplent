import App from 'next/app'
import getConfig from 'next/config'
import React from 'react'
import NProgress from 'nprogress'
import Router from 'next/router'
import localForage from 'localforage'

import { Title } from '@components/App'
import { is_server } from '@utility/misc'
import { ReactProps } from '@utility/props'
import { setup_scheduler } from '@server/tasks'
import { connect, synchronize_indexes } from '@server/db'

import { useUserStore, useTagStore, useNotificationStore } from '@client/store/user'
import { useCommissionRateStore, useCommissionStore, useCommissionsStore } from '@client/store/commission'

import '@assets/styles/imports.scss'
import '@assets/styles/rsuite.less'
import '@assets/styles/common.scss'
import { setup_streams } from '@db/streams'
import { Page } from '@components/App/Page'
import { STATES } from '@server/constants'

// Router.onRouteChangeStart = () => NProgress.start();
// Router.onRouteChangeComplete = () => NProgress.done();
// Router.onRouteChangeError = () => NProgress.done();

const { publicRuntimeConfig, serverRuntimeConfig }= getConfig()

const client_initialize = async () => {
    global.primus = new global.Primus()
    localForage.config({
      name        : 'komplent',
      version     : 1.0,
      storeName   : 'komplent', // Should be alphanumeric, with underscores.
      description : 'komplent'
  });
}

const server_initialize = async () => {
  if (!global.initialized) {
    global.store = {}
    global.initialized = true 
    await connect(serverRuntimeConfig.MONGODB_URL)
    await synchronize_indexes()
    if (STATES.MONGODB_CONNECTED) {
      await useTagStore.actions._create_defaults()
      await setup_streams()
    }
    await setup_scheduler(serverRuntimeConfig.REDIS_URL)
  }
}

export const StoreProvider = (props: ReactProps) => {
  return (
    <useUserStore.Provider>
      <useCommissionsStore.Provider>
        <useCommissionStore.Provider>
          <useCommissionRateStore.Provider>
            <useTagStore.Provider>
              <useNotificationStore.Provider>
                {props.children}
              </useNotificationStore.Provider>
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

    //const getLayout = Component.prototype instanceof Page ? Component.getLayout : (page => page)
    const getLayout =(page => page)

    return (
      <React.Fragment>
        <Title>Komplent</Title>
        <StoreProvider>
          {getLayout(<Component {...pageProps} />)}
        </StoreProvider>
      </React.Fragment>
    )
  }
}

if (publicRuntimeConfig && publicRuntimeConfig.RUNNING) {
  
  if (is_server()) {

    server_initialize()

  } else {

    client_initialize()

  }

}

export default KomplentApp