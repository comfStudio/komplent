import React from 'react';

import Placeholder from '@components/App/Placeholder'
import './InboxConversation.scss'
import useInboxStore from '@store/inbox';
import { Panel } from 'rsuite';

interface MessageProps {
    data: any
}

const Message = (props: MessageProps) => {
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

interface HeaderProps {
    data: any
}

const Header = (props: HeaderProps) => {
    const subject = props.data ? props.data.subject : ""
    return (
        <span>{subject}</span>
    );
};

interface InboxConversationProps {
}

const InboxConversation = (props: InboxConversationProps) => {

    const store = useInboxStore()
    const active = store.state.active_conversation

    return (
        <Panel bordered header={<Header data={active}/>}>
            <ul className="messages">
                {store.state.messages.map(d => <Message key={d._id} data={d}/>)}
                <Message/>
                <Message/>
                <Message/>
            </ul>

        </Panel>
    );
};

export default InboxConversation;