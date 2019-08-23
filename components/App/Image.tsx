import React, { Component } from 'react';

import { HTMLElementProps } from '@utility/props'


interface Props extends HTMLElementProps {
    placeholderText?: string
    w?: number
    h?: number
}

export const Image = (props: Props) => {
    let s =  `holder.js/${props.w ? props.w : 100}x${props.h ? props.h : 100}`
    if (props.placeholderText) {
        s += `?text=${props.placeholderText}`
    }
    return (
        <img className={props.className} data-src={s}/>
    );
}

export default Image;