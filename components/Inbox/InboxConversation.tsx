import React from 'react';

import Placeholder from '@components/App/Placeholder'
import './InboxConversation.scss'

const Message = () => {
    return (
        <li className="message">
            <span className="header">
                <h4>Pappa Frank</h4>
                <small>2019-07-23 15:52:16</small>
                <small>yesterday</small>
            </span>
            <div className="content">
                <Placeholder type="text" rows={3}/>
            </div>
        </li>
    );
};

const InboxConversation = () => {
    return (
        <ul className="messages">
            <Message/>
            <Message/>
            <Message/>
            <Message/>
        </ul>
    );
};

export default InboxConversation;