import React, { useState, useEffect } from 'react';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Button, Grid, Row, Col, IconButton, Icon, Input, Placeholder } from 'rsuite';

import './InboxConversation.scss'
import useInboxStore from '@store/inbox';
import { t } from '@app/utility/lang'
import { get_profile_name } from '@utility/misc';
import { formatDistanceToNow, toDate, format } from 'date-fns';
import { useUser } from '@hooks/user';
import { Avatar } from '@components/Profile/ProfileHeader';
import { useMountedState } from 'react-use';

interface MessageProps {
    data: any
    user: any
}

const Message = (props: MessageProps) => {

    const [loading, set_loading] = useState(false)
    let u_name = props.data ? get_profile_name(props.data.user) : ''
    let date = toDate(props.data ? new Date(props.data.created) : new Date())
    let owner = props.data ? props.data.user._id === props.user._id : false

    return (
        <li className={`message${!owner ? ' right' : ''}`}>
            <Avatar/>
            <div className="body">
                <span className="header">
                    <h4>{u_name}</h4>
                    <small>{format(date as Date, "yyyy-MM-dd - HH:mm:ss")}</small>
                    <small>{formatDistanceToNow(date, {addSuffix: true})}</small>
                </span>
                <div className="content">
                    {loading && <Placeholder.Paragraph rows={3}/>}
                    {!loading && props.data.body}
                </div>
            </div>
        </li>
    );
};

interface MessageInputProps {
    onMessage: (message: string) => Promise<any>
}

const MessageInput = (props: MessageInputProps) => {
    const [loading, set_loading] = useState(false)
    const [message, set_message] = useState("")

    return (
        <Panel bodyFill>
        <form onSubmit={(ev) => {
            ev.preventDefault();
            if (props.onMessage) {
                if (message) {
                    set_loading(true)
                    set_message("")
                    props.onMessage(message).then(r => {
                        set_loading(false)
                    })
                }
            }
            }}>
            <Grid fluid>
                <Row>
                    <Col xs={22}>
                    <Input placeholder={t`Type...`} name="message" value={message} onChange={(v, ev) => {ev.preventDefault(); set_message(v)}} />
                    </Col>
                    <Col x={2}>
                    <IconButton loading={loading} type="submit" appearance="subtle" icon={ <Icon icon="send-o"/> }  />
                    </Col>
                </Row>
            </Grid>
        </form>
        </Panel>
    );
};

interface HeaderProps {
    data: any
}

const Header = (props: HeaderProps) => {
    const subject = props.data ? props.data.subject : ""
    return (
        <div>
            <span>{subject}</span>
            <hr/>
        </div>
    );
};

interface ConversationProps {
    messages: any[]
    conversation: any
    useStore: any
}

export const Conversation = (props: ConversationProps) => {

    const user = useUser()
    const [messages, set_messages] = useState(props.messages.slice().reverse())
    const store = props.useStore()
    const mounted = useMountedState()

    useEffect(() => {
        if (mounted) {
            set_messages(props.messages.slice().reverse())
        }
    }, [props.messages])

    const onMessage = async (message) => {
        let r = await store.new_message(user, props.conversation, message)
        if (r.status) {
            set_messages([...messages, r.body.data])
        }
        return r
    }

    return (
        <Panel bordered header={<Header data={props.conversation}/>}>
            <ul className="messages">
                {messages.slice(1).slice(-5).map(d => <Message key={d._id} user={user} data={d}/>)}
            </ul>
            <MessageInput onMessage={onMessage}/>
        </Panel>
    );
};

interface InboxConversationProps {
}

const InboxConversation = (props: InboxConversationProps) => {

    const store = useInboxStore()

    return <Conversation conversation={store.state.active_conversation} messages={store.state.messages} useStore={useInboxStore} />;
};

export default InboxConversation;