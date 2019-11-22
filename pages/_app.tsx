import App from 'next/app'
import getConfig from 'next/config'
import React from 'react'
import NProgress from 'nprogress'
import Router from 'next/router'
import localForage from 'localforage'
import { Tina, TinaCMS } from 'tinacms'
import { GitClient } from '@tinacms/git-client'

import { Title } from '@components/App'
import { is_server } from '@utility/misc'
import { ReactProps } from '@utility/props'
import { setup_scheduler } from '@server/tasks'
import { connect, synchronize_indexes } from '@server/db'
import { setup_aws } from '@services/aws'

import { useUserStore, useTagStore, useNotificationStore } from '@client/store/user'
import { useCommissionRateStore, useCommissionStore, useCommissionsStore } from '@client/store/commission'

import '@assets/styles/imports.scss'
import '@assets/styles/rsuite.less'
import '@assets/styles/common.scss'
import { setup_streams } from '@db/streams'
import { Page } from '@components/App/Page'
import { STATES } from '@server/constants'
import useInboxStore from '@store/inbox'
import useEarningsStore from '@store/earnings'
import CONFIG from '@server/config'

// Router.onRouteChangeStart = () => NProgress.start();
// Router.onRouteChangeComplete = () => NProgress.done();
// Router.onRouteChangeError = () => NProgress.done();

const client_initialize = async () => {
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
    setup_scheduler(CONFIG.REDIS_URL)
    setup_aws()
    await connect(CONFIG.MONGODB_URL)
    if (STATES.MONGODB_CONNECTED) {
      synchronize_indexes()
      await useTagStore.actions._create_defaults()
      await useUserStore.actions._create_defaults()
      await setup_streams()
    }
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
                <useInboxStore.Provider>
                  <useEarningsStore.Provider>
                    {props.children}
                  </useEarningsStore.Provider>
                </useInboxStore.Provider>
              </useNotificationStore.Provider>
            </useTagStore.Provider>
          </useCommissionRateStore.Provider>
        </useCommissionStore.Provider>
      </useCommissionsStore.Provider>
    </useUserStore.Provider>
  )
}

class KomplentApp extends App {
  tinacms: any
  constructor(props) {
    super(props)
    this.tinacms = new TinaCMS()
    const client = new GitClient('http://localhost:3005/___tina')
    this.tinacms.registerApi('git', client)
  }

  render() {
    const { Component, pageProps } = this.props

    //const getLayout = Component.prototype instanceof Page ? Component.getLayout : (page => page)
    const getLayout =(page => page)

    return (
      // <Tina cms={this.tinacms} position={"overlay"}>
      <>
        <Title>Komplent</Title>
        <StoreProvider>
          {getLayout(<Component {...pageProps} />)}
        </StoreProvider>
      </>
      // </Tina>
    )
  }
}

if (!process.env.BUILDING) {
  
  if (is_server()) {
  
    server_initialize()
  
  } else {
  
    client_initialize()
  
  }

}

export default KomplentApp