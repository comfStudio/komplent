// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file
import React, { useEffect } from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import sprite from 'svg-sprite-loader/runtime/sprite.build'
import { DefaultHeadMeta } from '@components/App/Misc'

class KomplentDocument extends Document {
    static async getInitialProps(ctx) {
        const spriteContent = sprite.stringify()

        const initialProps = await Document.getInitialProps(ctx)

        return {
            spriteContent,
            ...initialProps,
        }
    }

    render() {
        return (
            <Html>
                <Head>
                    <DefaultHeadMeta/>
                </Head>
                <body>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: this.props.spriteContent,
                        }}
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default KomplentDocument
