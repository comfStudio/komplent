import React from 'react'
import { NextPageContext } from 'next'
import { Blog, TinaPage } from '@components/App/Blog'

export default class Page extends TinaPage {

  static async getInitialProps(ctx: NextPageContext) {
    const { slug } = ctx.query
    let content = require(`./${slug}.json`)

    return {
        slug: slug,
        fileRelativePath: `pages/blog/${slug}.json`,
        title: content.title,
        subtitle: content.subtitle,
        updated: content.updated,
        body: content.body,
    }
  }

  render() {
    return <Blog {...this.props}/>
  }
}
