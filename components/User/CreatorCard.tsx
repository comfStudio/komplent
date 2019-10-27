import React, { Component } from 'react';
import { Panel, Button, Grid, Row, Col } from 'rsuite'
import Link from 'next/link';

import Image from '@components/App/Image'
import { t } from '@app/utility/lang'
import { HTMLElementProps } from '@app/utility/props'

import './CreatorCard.scss'
import { make_profile_id, make_profile_urlpath, make_commission_rate_urlpath } from '@utility/pages';
import { decimal128ToMoneyToString } from '@utility/misc';
import { CommissionButton } from '@components/Profile/ProfileCommission';
import Tag from '@components/Profile/Tag';

interface Props extends HTMLElementProps {
    data: any
    fluid?: boolean
}

export const CreatorCard = ({fluid = true, ...props}: Props) => {

    let rates = []
    if (props.data && props.data.rates) {
        rates = props.data.rates
    }

    return (
        <Panel bordered bodyFill className={`user-card ${fluid && 'w-full'}`}>
            <Link href={make_profile_urlpath(props.data)}>
                <a>
                <Grid fluid className="cover">
                    <Row>
                        <Col xs={8} className="!p-0"><Image fluid className="inline-block" placeholderText="1" h={70}/></Col>
                        <Col xs={8} className="!p-0"><Image fluid className="inline-block" placeholderText="1" h={70}/></Col>
                        <Col xs={8} className="!p-0"><Image fluid className="inline-block" placeholderText="1" h={70}/></Col>
                    </Row>
                </Grid>
                <div className="avatar border-r-4 border-l-4 border-t-4 border-white">
                    <Image placeholderText="3" w={80} h={80}/>
                </div>
                <div className="pl-4 pr-3 info">
                    <CommissionButton user={props.data} className="float-right mt-1" appearance="primary" size="sm">
                        {t`Commission`}
                    </CommissionButton>
                    <strong className="text-primary">{props.data.name}<small className="italic muted ml-1">{make_profile_id(props.data)}</small></strong>
                    <p className="font-light mt-2">
                        {!!rates.length &&
                            rates.map(r => {
                                return (
                                    <Link key={r._id} href={make_commission_rate_urlpath(props.data, r)}>
                                        <a className="commission-price">{decimal128ToMoneyToString(r.price)}</a>
                                    </Link>
                                )
                            })
                        }
                    </p>
                    <p>
                        <span className="tags">
                            {props.data.tags.map(t => <Tag key={t._id} color={t.color}>{t.name}</Tag>)}
                        </span>
                    </p>
                    {/* <blockquote>I draw illustrations and comics! I love taking commissions!</blockquote> */}
                </div>
                </a>
            </Link>
        </Panel>
    );
}

export default CreatorCard;