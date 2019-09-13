import React, { Component } from 'react';
import { HTMLElementProps } from '@utility/props'

import Placeholder from '@components/App/Placeholder'

interface Props extends HTMLElementProps {
    placeholderText?: string
    w?: number | string
    h?: number | string
    fluid?: boolean
}

export const Image = (props: Props) => {
    let s = {
        marginRight: 0,
        content: '',
        width: undefined,
        height: undefined,
    }
    if (props.placeholderText) {
        s.content = props.placeholderText
    }

    if (props.w)
        s.width = props.w
    if (props.h)
        s.height = props.h

    let cls = ""
    if (props.fluid) {
        cls += "w-full"
    }

    cls = props.className ? cls + ' ' + props.className : cls

    return (
        <Placeholder type="rect" ready={false} style={s} className={cls}>
            <img className={cls} data-src={s}/>
        </Placeholder>
    );
}

export default Image;