import React from 'react'
import { StoreProvider } from '@pages/_app'

export const S = (Cmp) => {
    return (props) => (<StoreProvider><Cmp {...props}/></StoreProvider>)
}

export const getPageProps = async (Page) => await Page.getInitialProps({pathname:"", query:{}, asPath:"mock", AppTree:null}
