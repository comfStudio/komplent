import React, { Component, memo } from 'react'
import { Placeholder } from 'rsuite'
import classnames from 'classnames'
import { HTMLElementProps } from '@utility/props'

interface Props extends HTMLElementProps, HTMLElementProps {
    w?: number | string
    h?: number | string
    fluid?: boolean
    src?: string
    loading?: boolean
}

export const Image = memo(function Image({loading, w, h, className, src, ...props}: Props) {
    let cls = classnames(className, { 'w-full': props.fluid, 'clickable': !!props.onClick })

    return src ? (
        <img {...props} className={cls} src={src} />
    ) : (
        <Placeholder.Graph
            {...props}
            active={loading}
            width={w}
            height={h}
            className={cls}
            style={{ margin: 0 }}
        />
    )
})

export default Image
