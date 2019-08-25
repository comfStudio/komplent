import React, { Component } from 'react';
import { Panel, Button, Grid, Row, Col } from 'rsuite'
import Link from 'next/link';

import Image from '@components/App/Image'
import { t } from '@app/utility/lang'
import { HTMLElementProps } from '@app/utility/props'

import './UserCard.scss'

interface Props extends HTMLElementProps {
    fluid?: boolean
}

export const UserCard = ({fluid = true, ...props}: Props) => {
    return (
        <Panel bordered bodyFill className={`user-card ${fluid && 'w-full'}`}>
            <Link href="#">
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
                    <Button className="float-right mt-1" appearance="primary" size="sm">
                        {t`Commission`}
                    </Button>
                    <strong className="text-pink-500">Twiddly</strong>
                    <p className="font-light text-gray-500">
                        <Link href="#">
                            <a className="text-gray-500 commission-price">5$</a>
                        </Link>
                        <span className="text-pink-400 commission-price"> • </span> 
                        <Link href="#">
                            <a className="text-gray-500 commission-price">10$</a>
                        </Link>
                        <span className="text-pink-400 commission-price"> • </span> 
                        <Link href="#">
                            <a className="text-gray-500 commission-price">25$</a>
                        </Link>
                    </p>
                    <blockquote>I draw illustrations and comics! I love taking commissions!</blockquote>
                </div>
                </a>
            </Link>
        </Panel>
    );
}

export default UserCard;