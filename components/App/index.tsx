import React from 'react';
import Head from 'next/head'

import { HTMLElementProps, ReactProps } from '@utility/props'

interface IconProps extends HTMLElementProps, ReactProps {
    name: string
    type?: "solid" | "regular" | "logo"
    size?: "extra-small" | "mini" | "small" | "medium" | "large"
    animation?: "spin" | "tada" | "flashing" | "bx-burst" | "fade-left" | "fade-right"
    hoverAnimation?: boolean
    border?: boolean | "circle"
    pull?: "left" | "right"
    rotate?: "90" | 90 | "180" | 180 | "270" | 270
    flip?: "vertical" | "horizontal"
    fixed?: boolean
}

export const Icon = (props: IconProps) => {
    let cls = "bx"
    let itype = "bx"
    switch (props.type) {
        case "logo":
            itype = "bxl"
            break
        case "solid":
            itype = "bxs"
            break
    }
    cls += ` ${itype}-${props.name}`

    switch (props.size) {
        case "extra-small":
        case "mini":
            cls += " bx-xs"
            break
        case "small":
            cls += " bx-sm"
            break
        case "medium":
            cls += " bx-md"
            break
        case "large":
            cls += " bx-lg"
            break
    }

    switch (props.border) {
        case "circle":
            cls += " bx-border-circle"
            break
        case true:
            cls += " bx-border"
            break
    }

    switch (props.pull) {
        case "left":
            cls += " bx-pull-left"
            break
        case "right":
            cls += " bx-pull-right"
            break
    }

    if (props.fixed) {
        cls += " bx-fw"
    }

    return (
        <i className={cls}>
        <Head key="boxicons-css">
            <link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css" />
        </Head>
        </i>
    );
};