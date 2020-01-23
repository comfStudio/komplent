import React, { memo } from 'react'
import Button, { ButtonProps } from 'rsuite/lib/Button'
import Head from 'next/head'

export const ToggleButton = memo(function ToggleButton({ active, appearance, ...props}: ButtonProps) {
    return (
        <Button appearance={active ? "primary" : "ghost"} {...props}/>
    )
})

export const CreatorHeadMeta = memo(function CreatorHeadMeta({}) {
    return (
        <Head key="site-card">
            <meta name="twitter:card" content="profile_summary" />
            <meta name="twitter:creator" content="@profile" />
            <meta property="og:url" content="profile_url" />
            <meta property="og:title" content="TITLE_FOR_YOUR_PAGE" />
            <meta property="og:description" content="DESCRIPTION_FOR_YOUR_PAGE" />
            <meta property="og:image" content="URL_FOR_YOUR_IMAGE" />
            <meta property="og:type" content="profile" />
            <meta property="og:profile:username" content="@username" />
        </Head>
    )
})

export const DefaultHeadMeta = memo(function DefaultHeadMeta() {
    return (
        <>
            <meta name="twitter:site" content="@komplent" />
            <meta property="og:site_name " content="Komplent" />
        </>
    )
})

export const StandardHeadMeta = memo(function StandardHeadMeta() {
    return (
        <Head key="site-card">
            <meta name="twitter:card" content="summary" />
            <meta property="og:url" content="http://bits.blogs.nytimes.com/2011/12/08/a-twitter-for-my-sister/" />
            <meta property="og:title" content="TITLE_FOR_YOUR_PAGE" />
            <meta property="og:description" content="DESCRIPTION_FOR_YOUR_PAGE" />
            <meta property="og:image" content="URL_FOR_YOUR_IMAGE" />
            <meta property="og:site_name " content="Komplent" />
            <meta property="og:type" content="website" />
        </Head>
    )
})