import React from 'react'
import { NextPageContext } from 'next'
import { Blog } from '@components/App/Blog'

export default function Page(props) {
  return <Blog {...props}/>
}

Page.getInitialProps = function(ctx: NextPageContext) {
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
