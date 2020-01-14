import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import { useCMS, useLocalForm, useWatchFormValues } from 'tinacms'

import { MainLayout, MainLayoutProps } from '@components/App/MainLayout'
import { t } from '@app/utility/lang'
import { formatDistanceToNow } from 'date-fns'

import './Blog.scss'

export class TinaPage<T = undefined> extends Component<T> {
  static TINA = true
}

export const Blog = (props: {title: string, subtitle: string, updated: string, fileRelativePath: string}) => {
    // grab the instance of the CMS to access the registered git API
let cms = useCMS()

// add a form to the CMS; store form data in `post`
let [post, form] = useLocalForm({
  id: props.fileRelativePath, // needs to be unique
  label: 'Edit Post',

  // starting values for the post object
  initialValues: {
    title: props.title,
  },

  // field definition
  fields: [
    {
      name: 'title',
      label: 'Title',
      component: 'text',
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      component: 'text',
    },
    {
      name: 'body',
      component: 'markdown',
      label: 'Body',
      description: 'Edit the body of the post here (markdown supported)',
    },
  ],

  // save & commit the file when the "save" button is pressed
  onSubmit(data) {
    return cms.api.git
      .writeToDisk({
        fileRelativePath: props.fileRelativePath,
        content: JSON.stringify({ title: data.title, body: data.body, updated: new Date() }),
      })
      .then(() => {
        return cms.api.git.commit({
          files: [props.fileRelativePath],
          message: `Commit from Tina: Update ${data.fileRelativePath}`,
        })
      })
  },
})

let writeToDisk = React.useCallback(formState => {
  cms.api.git.writeToDisk({
    fileRelativePath: props.fileRelativePath,
    content: JSON.stringify({ title: formState.values.title }),
  })
}, [])

useWatchFormValues(form, writeToDisk)

return (
  <BlogLayout>
    <h1>{post.title}</h1>
    {!!post.subtitle && <h2 className="muted">{post.title}</h2>}
    {post.updated &&
    <p className="muted mb-5">{t`Last updated:`} {formatDistanceToNow(new Date(post.updated), { addSuffix: true })}</p>
    }
    <Markdown data={post.body}/>
  </BlogLayout>
)
}

export const Markdown = ({data}: {data: string}) => {

    return (
        <ReactMarkdown source={data}/>
    )
}

export const BlogLayout = ({children, ...props}: MainLayoutProps) => {
    return (
        <MainLayout {...props}>
            <div className="blog">
                {children}
            </div>
        </MainLayout>
    )
}

export default Blog