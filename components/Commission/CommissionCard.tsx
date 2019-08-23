import React, { Component } from 'react';

import { Panel, Button } from 'rsuite'

import Image from '@components/App/Image'

import { t } from '@app/utility/lang'

import './CommissionCard.scss'

class CommissionCard extends Component {
    render() {
        return (
            <Panel bordered bodyFill className="commission-card">
                <div className="cover">
                <Image className="inline-block" placeholderText="1" w={70} h={70}/>
                <Image className="inline-block" placeholderText="2" w={70} h={70}/>
                <Image className="inline-block" placeholderText="3" w={70} h={70}/>
                </div>
                <div className="avatar border-r-4 border-l-4 border-t-4 border-white">
                    <Image placeholderText="3" w={80} h={80}/>
                </div>
                <div className="px-5 info">
                    <Button className="float-right mt-1" appearance="primary" size="sm">
                        {t`Commission`}
                    </Button>
                    <strong className="text-pink-500">Twiddly</strong>
                    <p className="font-light text-gray-500">
                        5$ <span className="text-pink-400"> • </span> 
                        10$ <span className="text-pink-400"> • </span> 
                        25$
                    </p>
                </div>
            </Panel>
        );
    }
}

export default CommissionCard;