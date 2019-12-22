import React, { Component } from 'react'
import { Panel, Button, Grid, Row, Col, FlexboxGrid } from 'rsuite'
import Link from 'next/link'

import Image from '@components/App/Image'
import { t } from '@app/utility/lang'
import { HTMLElementProps } from '@app/utility/props'

import './CreatorCard.scss'
import {
    make_profile_id,
    make_profile_urlpath,
    make_commission_rate_urlpath,
} from '@utility/pages'
import { decimal128ToMoneyToString, get_profile_name, get_profile_avatar_url } from '@utility/misc'
import Tag from '@components/Profile/Tag'
import CommissionButton from '@components/Commission/CommissionButton'
import { ProfileContext } from '@client/context'
import { FollowButton } from '@components/Profile'

interface Props extends HTMLElementProps {
    data: any
    fluid?: boolean
}

export const CreatorCard = ({ fluid = true, ...props }: Props) => {
    let rates = []
    if (props.data && props.data.rates) {
        rates = props.data.rates
    }

    return (
        <Panel bordered bodyFill className={`creator-card ${fluid && 'w-full'}`}>
            <Link href={make_profile_urlpath(props.data)}>
                <a className="unstyled">
                    <Grid fluid>
                        <Row>
                            <Col xs={8} className="!p-0">
                                <Image
                                    fluid
                                    className="inline-block"
                                    h={100}
                                />
                            </Col>
                            <Col xs={8} className="!p-0">
                                <Image
                                    fluid
                                    className="inline-block"
                                    h={100}
                                />
                            </Col>
                            <Col xs={8} className="!p-0">
                                <Image
                                    fluid
                                    className="inline-block"
                                    h={100}
                                />
                            </Col>
                        </Row>
                        <Row>
                            {!!rates.length &&
                            <Col className="font-light mb-2 w-full text-center">
                                {
                                    rates.map(r => {
                                        return (
                                            <Link
                                                key={r._id}
                                                href={make_commission_rate_urlpath(
                                                    props.data,
                                                    r
                                                )}>
                                                <a className="commission-price">
                                                    {r.price === null ? t`Custom` : decimal128ToMoneyToString(r.price)}
                                                </a>
                                            </Link>
                                        )
                                    })
                                }
                            </Col>
                            }
                        </Row>
                        <Row className="mb-1">
                            <Col xs={6}>
                                <div className="avatar">
                                    <Image w={80} h={80} src={get_profile_avatar_url(props.data)} />
                                </div>
                            </Col>
                            <Col xs={18}>
                                <FlexboxGrid className="!flex-col">
                                    <FlexboxGrid.Item className="name !flex-grow">{get_profile_name(props.data)} <span className="muted text-sm">(@{props.data.username})</span></FlexboxGrid.Item>
                                    <FlexboxGrid.Item className="text-center !flex-grow w-full p-2">
                                        <CommissionButton
                                            user={props.data}
                                            appearance="primary"
                                            size="sm"/>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </Col>
                        </Row>
                        {!!props.data.tags.length &&
                        <Row className="mb-1">
                            <Col xs={24} className="tags">
                                {props.data.tags.map(t => (
                                    <Tag key={t._id} color={t.color} className="subtle">
                                        {t.name}
                                    </Tag>
                                ))}
                            </Col>
                        </Row>
                        }
                    </Grid>
                </a>
            </Link>
        </Panel>
    )
}

export default CreatorCard
