import React, { Component, useState } from 'react'

import { Grid, Col, Row, InputGroup, Button, Icon, ButtonGroup, FlexboxGrid } from 'rsuite'
import Link from 'next/link'
import { useRouter } from 'next/router'
import qs from 'qs'

import { Container, MainLayout } from '@components/App/MainLayout'
import InboxSidebar from '@components/Inbox/InboxSidebar'
import InboxSearch from '@components/Inbox/InboxSearch'
import InboxList from '@components/Inbox/InboxList'
import InboxConversation from '@components/Inbox/InboxConversation'

import { t } from '@app/utility/lang'
import NewConvoModal from './NewConvoModal'
import useInboxStore, { InboxKey } from '@store/inbox'
import * as pages from '@utility/pages'
import Empty from '@components/App/Empty'
import { ToggleButton } from '@components/App/Misc'

interface Props {
    activeKey?: InboxKey
}

const InboxLayout = (props: Props) => {
    const router = useRouter()
    const store = useInboxStore()

    const btn_state = {
        commission: router.query.type === 'commission' || router.query.type === undefined,
        staff: router.query.type === 'staff',
        private: router.query.type === 'private',
    }

    const [show, set_show] = useState(false)

    return (
        <MainLayout activeKey="inbox">
            {show && (
                <NewConvoModal
                    show={show}
                    onClose={() => {
                        set_show(false)
                    }}
                />
            )}
            <Grid fluid className="mt-2">
                <Row>
                    <Col xs={4}>
                        <Button
                            appearance="primary"
                            onClick={ev => {
                                ev.preventDefault()
                                set_show(true)
                            }}>
                            <Icon icon="plus" /> {t`New conversation`}
                        </Button>
                    </Col>
                    <Col xs={20}>
                        <InboxSearch />
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col xsPush={1} xs={23} className="clearfix mb-2">
                        <ButtonGroup>
                            <Link href={pages.inbox + '?' + qs.stringify({ type:'commission' })} passHref>
                                <ToggleButton active={btn_state.commission} componentClass="a">{t`Commission`}</ToggleButton>
                            </Link>
                            <Link href={pages.inbox + '?' + qs.stringify({ type:'private' })} passHref>
                                <ToggleButton active={btn_state.private} componentClass="a">{t`Personal`}</ToggleButton>
                            </Link>
                            <Link href={pages.inbox + '?' + qs.stringify({ type:'staff' })} passHref>
                                <ToggleButton active={btn_state.staff} componentClass="a">{t`Staff`}</ToggleButton>
                            </Link>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <FlexboxGrid>
                            <FlexboxGrid.Item className="!flex-grow" colspan={22} componentClass={Col} xs={7}>
                                <InboxList />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} xs={17}>
                                {!!store.state.active_conversation &&
                                    <InboxConversation />
                                }
                                {!store.state.active_conversation && <Empty type="begin_chat"/>}
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Col>
                </Row>
            </Grid>
        </MainLayout>
    )
}

export default InboxLayout
