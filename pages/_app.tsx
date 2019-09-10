import App from 'next/app'
import getConfig from 'next/config'
import React from 'react'

import { Title } from '@components/App'
import { connect } from '@server/db'

import '@assets/styles/rsuite.less'
import '@assets/styles/imports.scss'
import '@assets/styles/common.scss'

import Head from 'next/head';

const {
  publicRuntimeConfig: {},
  serverRuntimeConfig: {MONGODB_URL}
} = getConfig()

class KomplentApp extends App {
  public static async getInitialProps({ Component, router, ctx }) {
    //
    // Use getInitialProps as a step in the lifecycle when
    // we can initialize our store
    //
    const isServer = typeof window === 'undefined'

    if ( isServer) {
      connect()
    }

    //
    // Check whether the page being rendered by the App has a
    // static getInitialProps method and if so call it
    //
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      isServer,
      pageProps,
    }
  }

  public render() {
    const { Component, pageProps } = this.props
    return (
      <React.Fragment>
        <Title>Komplent</Title>
        <Component {...pageProps} />
      </React.Fragment>
    )
  }
}

export default KomplentApp
