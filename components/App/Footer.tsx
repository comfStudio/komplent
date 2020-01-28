import React, { memo } from 'react';
import { Row, Col } from 'rsuite';

import { t } from '@app/utility/lang'
import * as pages from '@utility/pages'
import Link from 'next/link';

const Footer = memo(function Footer() {
    return (
        <>
            <Row className="text-white">
                <Col xs={4}>
                <dl>
                    <dt><h4>{t`About Us`}</h4></dt>
                    <dd>Affiliates</dd>
                    <dd>Press</dd>
                    <dd>Contact us</dd>
                </dl>
                </Col>
                <Col xs={4}>
                <dl>
                    <dt><h4>{t`Creators`}</h4></dt>
                    <dd>How does it work?</dd>
                    <dd>Why use Komplent?</dd>
                    <dd>Guidelines</dd>
                </dl>
                </Col>
                <Col xs={4}>
                <dl>
                    <dt><h4>{t`Clients`}</h4></dt>
                    <dd>How does it work?</dd>
                    <dd>Why use Komplent?</dd>
                    <dd>Guidelines</dd>
                </dl>
                </Col>
                <Col xs={4}>
                <dl>
                    <dt><h4>{t`Help & FAQ`}</h4></dt>
                    <dd>Quesion?</dd>
                    <dd>Question?</dd>
                    <dd>Support</dd>
                </dl>
                </Col>
                <Col xsPush={5} xs={3}>
                <dl>
                    <dt><h4>{t`Follow Us`}</h4></dt>
                    <dd>Twitter</dd>
                    <dd>Facebook</dd>
                    <dd>Instagram</dd>
                </dl>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col xs={24}>
                    <ul className="text-white footer-list">
                        <li className="text-gray-300">© Requestable 2019</li>
                        <li><Link href="/terms-and-conditions"><a>{t`Terms of Use`}</a></Link></li>
                        <li><Link href="/refund-policy"><a>{t`Cancellation & Refund Policy`}</a></Link></li>
                        <li><Link href="/privacy-policy"><a>{t`Privacy Policy`}</a></Link></li>
                        <li><Link href="/copyright-policy"><a>{t`Copyright Policy`}</a></Link></li>
                    </ul>
                </Col>
            </Row>
        </>
    );
})

export default Footer;