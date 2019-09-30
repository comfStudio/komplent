// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import Document, { Html, Head, Main, NextScript } from 'next/document'
import sprite from 'svg-sprite-loader/runtime/sprite.build';
import { connect } from '@server/db'

const server_initialize = async () => {
  await connect()
}

class KomplentDocument extends Document {
  static async getInitialProps(ctx) {
    const spriteContent = sprite.stringify();
    const initialProps = await Document.getInitialProps(ctx)
    return {
        spriteContent,
        ...initialProps }
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

if (process.env.SERVER_BUILD) {
  server_initialize()
}


export default KomplentDocument
