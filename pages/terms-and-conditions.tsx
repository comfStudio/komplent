import React from 'react'
import { NextPageContext } from 'next'
import { Blog } from '@components/App/Blog'

export default function Page(props) {
  return <Blog {...props}/>
}

Page.getInitialProps = function(ctx: NextPageContext) {
    const slug = "terms-and-conditions"
    let content = require(`./${slug}.json`)

    return {
        slug: slug,
        fileRelativePath: `pages/${slug}.json`,
        title: content.title,
        subtitle: content.subtitle,
        body: content.body,
    }
}
