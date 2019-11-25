import React, { Component } from 'react'
import { Navbar, Nav } from 'rsuite'
import Link from 'next/link'

import { Container } from '@components/App/MainLayout'

import { t } from '@app/utility/lang'
import { ReactProps } from 'utility/props'

import './ProfileReviews.scss'

export interface Props {}

export const ReviewsReel = () => {
    return (
        <div className="w-full reviews-reel inline-block">
            <blockquote>
                Such outstanding artwork!! He completed my commission very
                quickly and made sure it looked exactly as I wanted it to!
                <cite> - Johan Algerd</cite>
            </blockquote>
        </div>
    )
}

export const ProfileReviews = () => {
    return <div></div>
}

export default ProfileReviews
