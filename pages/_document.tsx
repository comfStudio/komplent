// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import Document, { Html, Head, Main, NextScript } from 'next/document'
import symbol from 'svg-baker-runtime/symbol';
import sprite from 'svg-sprite-loader/runtime/sprite.build';

class MyDocument extends Document {
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
        <Head />
        <body>
          <div dangerouslySetInnerHTML={{ __html: this.props.spriteContent }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
