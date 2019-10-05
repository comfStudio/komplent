// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file
import React, { useEffect } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document'
import sprite from 'svg-sprite-loader/runtime/sprite.build';
import getConfig from 'next/config'

import { connect, synchronize_indexes } from '@server/db'
import { Props as AuthProps, AuthPage, getAuthProps } from '@components/App/AuthPage'
import { useMount } from 'react-use';

const { publicRuntimeConfig, serverRuntimeConfig }= getConfig()

const server_initialize = async () => {
  await connect()
  await synchronize_indexes()
}

class KomplentDocument extends Document<AuthProps> {
  static async getInitialProps(ctx) {
    const spriteContent = sprite.stringify();

    const initialProps = await Document.getInitialProps(ctx)

    return {
        spriteContent,
        ...initialProps,
    }
  }

  render() {
    return (
      <Html>
        <Head/>
        <body>
          <div dangerouslySetInnerHTML={{ __html: this.props.spriteContent }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

if (Object.entries(serverRuntimeConfig).length && typeof window === 'undefined') {
  server_initialize()
}


export default KomplentDocument
