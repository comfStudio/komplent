import React, { useState, useEffect } from 'react';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Button, Grid, Row, Col, IconButton, Icon, Input } from 'rsuite';

import Placeholder from '@components/App/Placeholder'
import './InboxConversation.scss'
import useInboxStore from '@store/inbox';
import { t } from '@app/utility/lang'
import { get_profile_name } from '@utility/misc';
import { formatDistanceToNow, toDate, format } from 'date-fns';
import { useUser } from '@hooks/user';

interface MessageProps {
    data: any
}

const Message = (props: MessageProps) => {

    const [loading, set_loading] = useState(false)
    let u_name = props.data ? get_profile_name(props.data.user) : ''
    let date = toDate(props.data ? new Date(props.data.created) : new Date())

    return (
        <li className="message">
            <span className="header">
                <h4>{u_name}</h4>
                <small>{format(date as Date, "yyyy-MM-dd - HH:mm:ss")}</small>
                <small>{formatDistanceToNow(date, {addSuffix: true})}</small>
            </span>
            <div className="content">
                {loading && <Placeholder type="text" rows={3}/>}
                {!loading && props.data.body}
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

interface InboxConversationProps {
}

const InboxConversation = (props: InboxConversationProps) => {

    const user = useUser()
    const store = useInboxStore()
    const active = store.state.active_conversation
    const [messages, set_messages] = useState([])

    useEffect(() => {
        set_messages(store.state.messages.reverse())
    }, [store.state.messages])

    const onMessage = async (message) => {
        let r = await store.new_message(user, active, message)
        if (r.status) {
            set_messages([...messages, r.body.data])
        }
        return r
    }

    return (
        <Panel bordered header={<Header data={active}/>}>
            <ul className="messages">
                {messages.slice(1).slice(-5).map(d => <Message key={d._id} data={d}/>)}
            </ul>
            <MessageInput onMessage={onMessage}/>
        </Panel>
    );
};

export default InboxConversation;