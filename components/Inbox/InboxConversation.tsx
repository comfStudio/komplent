import React, { useState, useEffect, useRef } from 'react'
import {
    Panel,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Button,
    Grid,
    Row,
    Col,
    IconButton,
    Icon,
    Input,
    Placeholder,
    Tag,
} from 'rsuite'
import classnames from 'classnames'
import Link from 'next/link'

import './InboxConversation.scss'
import useInboxStore from '@store/inbox'
import { t } from '@app/utility/lang'
import { get_profile_name, get_profile_avatar_url } from '@utility/misc'
import { formatDistanceToNow, toDate, format } from 'date-fns'
import { useUser } from '@hooks/user'
import { Avatar } from '@components/Profile/ProfileHeader'
import { useMountedState } from 'react-use'
import { EmptyPanel } from '@components/App/Empty'
import Image from '@components/App/Image'
import { useRouter } from 'next/router'
import * as pages from '@utility/pages'

interface MessageProps {
    data: any
    user: any
    store: any
}

const Message = (props: MessageProps) => {
    const [loading, set_loading] = useState(false)
    const [unread, set_unread] = useState(false)

    let u_name = props.data ? get_profile_name(props.data.user) : ''
    let date = toDate(props.data ? new Date(props.data.created) : new Date())
    let owner = props.data ? props.data.user._id === props.user._id : false

    useEffect(() => {

        if (!props.data.users_read.includes(props.user._id)) {
            props.store.mark_message_read(props.user, props.data)
        }

        set_unread(!props.data.users_read.includes(props.user._id))

    }, [props.data._id])

    return (
        <li className={classnames("message", {right: !owner, unread})}>
            <Image src={get_profile_avatar_url(props.data.user)} w={50} h={50} className="avatar"/>
            <div className="body">
                <span className={classnames("header")}>
                    <h4>{u_name}</h4>
                    <small>
                        {format(date as Date, 'yyyy-MM-dd - HH:mm:ss')}
                    </small>
                    <small>
                        {formatDistanceToNow(date, { addSuffix: true })}
                    </small>
                </span>
                <div className="content">
                    {loading && <Placeholder.Paragraph rows={3} />}
                    {!loading && props.data.body}
                </div>
            </div>
        </li>
    )
}

interface MessageInputProps {
    onMessage: (message: string) => Promise<any>
}

const MessageInput = (props: MessageInputProps) => {
    const [loading, set_loading] = useState(false)
    const [message, set_message] = useState('')

    return (
        <Panel bodyFill>
            <form
                onSubmit={ev => {
                    ev.preventDefault()
                    if (props.onMessage) {
                        if (message) {
                            set_loading(true)
                            set_message('')
                            props.onMessage(message).then(r => {
                                set_loading(false)
                            })
                        }
                    }
                }}>
                <Grid fluid>
                    <Row>
                        <Col xs={22}>
                            <Input
                                placeholder={t`Type...`}
                                name="message"
                                value={message}
                                onChange={(v, ev) => {
                                    ev.preventDefault()
                                    set_message(v)
                                }}
                            />
                        </Col>
                        <Col x={2}>
                            <IconButton
                                loading={loading}
                                type="submit"
                                appearance="subtle"
                                icon={<Icon icon="send-o" />}
                            />
                        </Col>
                    </Row>
                </Grid>
            </form>
        </Panel>
    )
}

interface HeaderProps {
    data: any
}

const Header = (props: HeaderProps) => {
    const subject = props.data ? props.data.subject : ''
    let date = toDate(props.data ? new Date(props.data.created) : new Date())

    const [commission_id, set_commission_id] = useState("")
    const [tag, set_tag] = useState({ text: "", color: ""})

    useEffect(() => {
        switch (props.data.type) {
            case "private":
                set_tag({ text: t`Personal`, color: "blue"})
                set_commission_id("")
                break;
            case "commission":
                {
                    set_tag({ text: t`Commission`, color: "red"})
                    set_commission_id(props.data.commission)
                }
                break;
            case "staff":
                set_tag({ text: t`Staff`, color: "violet"})
                set_commission_id("")
                break;
            default:
                break;
        }
    }, [props.data])

    return (
        <div className="convo-header">
            <h4>{subject}</h4>
            <p className="muted">
                <Tag color={tag.color}>{tag.text}</Tag>
                <span className="metadata">
                    {format(date as Date, 'yyyy-MM-dd - HH:mm:ss')}
                </span>
                <span className="metadata">
                    {formatDistanceToNow(date, { addSuffix: true })}
                </span>
                {!!commission_id &&
                <span className="metadata">
                    <Link href={pages.commission + `/${commission_id}`}><Button appearance="primary" size="xs" componentClass="a">{t`Go to commission`}</Button></Link>
                </span>
                }
            </p>
        </div>
    )
}

interface ConversationProps {
    messages: any[]
    conversation: any
    useStore: any
    noHeader?: boolean
    noBorder?: boolean
}

export const Conversation = (props: ConversationProps) => {
    const user = useUser()
    const router = useRouter()
    const [loading, set_loading] = useState(false)
    const [page, set_page] = useState(0)
    const [messages, set_messages] = useState(props.messages)
    const store = props.useStore()
    const mounted = useMountedState()
    const message_top = useRef(null)

    const scroll_to_bottom = (behavior = "smooth") => {
        if (message_top.current) {
            message_top.current.scrollIntoView({ behavior, block: 'nearest' })
        }
    }

    useEffect(() => {
        if (mounted) {
            set_messages(props.messages)
        }
        scroll_to_bottom("auto")
    }, [props.messages])
    
    useEffect(() => {
        set_page(0)
    }, [router.query])

    const onMessage = async message => {
        let r = await store.new_message(user, props.conversation, message)
        if (r.status) {
            set_messages([r.body.data, ...messages])
            scroll_to_bottom()
            if (store.state.conversations !== undefined) {
                store.setState({conversations: [store.state.conversations.filter(v => v._id === props.conversation._id)[0], ...store.state.conversations.filter(v => v._id !== props.conversation._id)]})
            }
        }
        return r
    }

    return (
        <Panel className="message-list" bordered={!props.noBorder} header={props.noHeader ? undefined : <Header data={props.conversation} />}>
            <MessageInput onMessage={onMessage} />
            {!!messages.length &&
            <ul className="messages">
                <div ref={message_top}/>
                {messages.map(d => (
                        <Message key={d._id} store={store} user={user} data={d} />
                        ))}
                
                <div className="text-center w-full mb-2"><Button loading={loading} appearance="subtle" onClick={ev => {
                    ev.preventDefault();
                    const next_page = page + 1
                    set_page(next_page)
                    set_loading(true)

                    store.get_messages(props.conversation._id, { page: next_page }).then(r => {
                        set_messages([...messages, ...r])
                        set_loading(false)
                    })

                    }}>{t`Load more`}</Button></div>
            </ul>
            }
            {!messages.length && <EmptyPanel type="begin_chat" subtitle={`Send your first message`}/>}
        </Panel>
    )
}

interface InboxConversationProps {}

const InboxConversation = (props: InboxConversationProps) => {
    const store = useInboxStore()

    return (
        <Conversation
            conversation={store.state.active_conversation}
            messages={store.state.messages}
            useStore={useInboxStore}
        />
    )
}

export default InboxConversation
