import React, { Component } from 'react'
import { Placeholder } from 'rsuite'
import classnames from 'classnames'
import { HTMLElementProps } from '@utility/props'

interface Props extends HTMLElementProps {
    w?: number | string
    h?: number | string
    fluid?: boolean
    src?: string
}

export const Image = (props: Props) => {
    let cls = classnames(props.className, { 'w-full': props.fluid })

    return props.src ? (
        <img className={cls} src={props.src} />
    ) : (
        <Placeholder.Graph
            width={props.w}
            height={props.h}
            className={cls}
            style={{ margin: 0 }}
        />
    )
}

export default Image
