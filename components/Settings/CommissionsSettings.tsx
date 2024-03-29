import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSessionStorage, useMountedState } from 'react-use'
import {
    InputNumber,
    List,
    Grid,
    Button,
    DatePicker,
    Icon,
    Message,
    Input,
    Row,
    Col,
    Placeholder,
    RadioGroup,
    Radio,
    Whisper,
    IconButton,
    Popover,
    HelpBlock,
    Badge,
    Tag,
} from 'rsuite'

import { EditGroup, EditSection } from '.'
import { t } from '@app/utility/lang'
import CommissionRateForm, {
    RateOptionsForm,
} from '@components/Form/CommissionRateForm'
import { CommissionTiersRow } from '@components/Profile/ProfileCommission'
import TextEditor from '@components/App/TextEditor'
import { useCommissionStore } from '@store/commission'
import {
    CommissionPhaseType,
    CommissionPhaseT,
    guideline_types,
    GuidelineType,
    Guideline,
} from '@server/constants'
import useUserStore from '@store/user'
import debounce from 'lodash/debounce'
import { CommissionProcessType } from '@schema/user'
import { useUpdateDatabase } from '@hooks/db'
import LicenseForm from '@components/Form/LicenseForm'

const Deadline = () => {
    const store = useCommissionStore()
    const commission = store.get_commission()

    const update = useCallback(
        debounce((v: number, ev) => {
            store.update({ commission_deadline: Math.round(v) })
        }, 400),
        []
    )

    return (
        <EditGroup>
            <span className="mr-2">{t`Deadline`}: </span>
            <div className="w-32">
                <InputNumber
                    defaultValue={commission.commission_deadline}
                    min={0}
                    postfix={t`days`}
                    onChange={update}
                />
            </div>
        </EditGroup>
    )
}

export const CommissionLimit = () => {
    const store = useUserStore()

    const update = useCallback(
        debounce((v: number, ev) => {
            store.update_user({ ongoing_commissions_limit: Math.round(v) })
        }, 400),
        []
    )

    return (
        <EditGroup title={t`Maximum amount of on-going commissions` + ':'}>
            <div className="w-32">
                <InputNumber
                    defaultValue={
                        store.state.current_user.ongoing_commissions_limit
                    }
                    min={1}
                    onChange={update}
                />
            </div>
        </EditGroup>
    )
}

export const CommissionRequestLimit = () => {
    const store = useUserStore()

    const update = useCallback(
        debounce((v: number, ev) => {
            store.update_user({ ongoing_requests_limit: Math.round(v) })
        }, 400),
        []
    )

    return (
        <EditGroup title={t`Maximum amount of on-going requests` + ':'}>
            <div className="w-32">
                <InputNumber
                    defaultValue={
                        store.state.current_user.ongoing_requests_limit
                    }
                    min={1}
                    onChange={update}
                />
            </div>
        </EditGroup>
    )
}

export const CommissionGuideline = () => {
    const store = useUserStore()

    const titles = (v: Guideline) => {
        switch (v) {
            case GuidelineType.will_draw:
                return t`Will draw`
            case GuidelineType.will_not_draw:
                return t`Will not draw`
        }
    }

    const guidelines = store.state.current_user?.commission_guidelines ?? []

    return (
        <React.Fragment>
            {guideline_types.map(gtype => {
                const [gtext, set_gtext] = useState('')

                return (
                    <EditGroup margin key={gtype} title={titles(gtype)}>
                        <EditSection>
                            <List>
                                {guidelines
                                    .filter(v => v.guideline_type === gtype)
                                    .map(({ guideline_type, value }, idx) => (
                                        <List.Item key={idx.toString() + value}>
                                            <a
                                                href="#"
                                                onClick={ev => {
                                                    ev.preventDefault()
                                                    store.update_user({
                                                        commission_guidelines: guidelines.filter(
                                                            v =>
                                                                !(
                                                                    v.value ===
                                                                        value &&
                                                                    v.guideline_type ===
                                                                        gtype
                                                                )
                                                        ),
                                                    })
                                                }}>
                                                <Icon
                                                    className="mr-2"
                                                    icon="minus-circle"
                                                />
                                            </a>
                                            {value}
                                        </List.Item>
                                    ))}
                                <List.Item key="add">
                                    <form
                                        onSubmit={ev => {
                                            ev.preventDefault()
                                            if (
                                                gtext &&
                                                !guidelines.filter(
                                                    v =>
                                                        v.value === gtext &&
                                                        v.guideline_type ===
                                                            gtype
                                                ).length
                                            ) {
                                                store
                                                    .update_user({
                                                        commission_guidelines: [
                                                            ...guidelines,
                                                            {
                                                                guideline_type: gtype,
                                                                value: gtext,
                                                            },
                                                        ],
                                                    })
                                                    .then(r => {
                                                        if (r.status) {
                                                            set_gtext('')
                                                        }
                                                    })
                                            }
                                        }}>
                                        <Grid fluid>
                                            <Row>
                                                <Col xs={19}>
                                                    <Input
                                                        value={gtext}
                                                        onChange={set_gtext}
                                                        size="xs"
                                                    />
                                                </Col>
                                                <Col xs={5}>
                                                    <Button
                                                        type="submit"
                                                        size="sm">{t`Add`}</Button>
                                                </Col>
                                            </Row>
                                        </Grid>
                                    </form>
                                </List.Item>
                            </List>
                        </EditSection>
                    </EditGroup>
                )
            })}
        </React.Fragment>
    )
}

export const CountTagEdit = ({value, onChange, min = 0}: {value?: number, min?: number, onChange?: (v: number, event: any) => void}) => {

    const [edit, set_edit] = useState(false)

    return (
        edit ?
        <Tag color="blue">{t`Count`}: <form onSubmit={ev => {ev.preventDefault(); console.log(edit); set_edit(false) }}><InputNumber min={min} size="xs" className="w-4" value={value} onChange={onChange}/></form></Tag>
        :
        (
        <a href="#" onClick={ev => {ev.stopPropagation(); ev.preventDefault(); set_edit(true)}} className="z-10 ml-2">
            <Tag color="blue">{t`Count`}: {value}</Tag>
        </a>
        )
    )
}

interface CommissionProcessProps {
    commission?: boolean
}

export const CommissionProcess = (props: CommissionProcessProps) => {
    let accepted = false
    let def_stages: CommissionProcessType[], user, comm_store, user_store

    if (props.commission) {
        comm_store = useCommissionStore()
        accepted = comm_store.get_commission().accepted
        def_stages = comm_store.get_commission().commission_process
    } else {
        user_store = useUserStore()
        user = user_store.state.current_user
        def_stages = user.commission_process
    }
    const [stages_limit, set_stages_limit] = useState({})
    const [stages_minimum, set_stages_minimum] = useState({})
    const [dirty, set_dirty] = useState(false)
    const [stages, set_stages] = useState(def_stages)
    const prev_stages = useRef(stages)

    const get_name = (v: CommissionPhaseType) => {
        switch (v) {
            case 'negotiate':
                return t`A price is negotiated`
            case 'pending_approval':
                return t`Commission is approved`
            case 'pending_sketch':
                return t`Creator provides a draft`
            case 'pending_payment':
                return t`Client should pay`
            case 'pending_product':
                return t`Creator provides assets`
            case 'revision':
                return t`Client can ask for revisions`
            case 'complete':
                return t`Commission is completed`
            case 'unlock':
                return t`Client access to assets is unlocked`
        }
    }

    const get_help = (v: CommissionPhaseType) => {
        switch (v) {
            case 'pending_approval':
                return t`Commission is approved`
            case 'pending_sketch':
                return t`Creator provides a draft`
            case 'pending_payment':
                return t`Client should pay`
            case 'pending_product':
                return t`Creator provides assets`
            case 'revision':
                return t`Client can ask for revisions`
            case 'complete':
                return t`Commission is completed`
            case 'unlock':
                return t`Client access to assets is unlocked`
        }
    }

    const collections = useCommissionStore.actions.get_stages_collections()

    const update = async data => {
        data = await useCommissionStore.actions.process_stages(data)
        if (
            !(
                data.length === prev_stages.current.length &&
                data.every((v, i) => prev_stages[i]?.type === v.type)
            )
        ) {
            prev_stages.current = data
            set_stages(data)
            if (props.commission) {
                comm_store.update({ commission_process: data })
            } else {
                user_store.update_user({ commission_process: data })
            }
        }
        set_dirty(false)
    }

    const handleSortEnd = async ({ oldIndex, newIndex }) => {
        const move_data = stages.splice(oldIndex, 1)
        const new_data = [...stages]
        new_data.splice(newIndex, 0, move_data[0])
        set_stages(useCommissionStore.actions.process_stages_collections(new_data))
        set_dirty(true)
    }

    useEffect(() => {
        useCommissionStore.actions.get_stages_limits().then(r => {set_stages_minimum(r.limit); set_stages_minimum(r.minimum)})
    }, [props.commission])

    const addable_stages: CommissionPhaseType[] = [
        CommissionPhaseT.pending_payment,
        CommissionPhaseT.pending_product,
        CommissionPhaseT.pending_sketch,
        CommissionPhaseT.revision,
    ]

    return (
        <EditGroup>
            <HelpBlock className="mb-4">{t`Design how the commission process should proceed`}</HelpBlock>
            {accepted && (
                <Message
                    className="mb-2"
                    type="warning"
                    description={t`The commission process cannot be changed once the commission has been accepted`}
                />
            )}
            <List className="">
                <List.Item>
                    {addable_stages.map(v => (
                        <span className="mr-1" key={v}>
                            <Button
                                disabled={
                                    accepted ||
                                    stages.filter(i => i.type === v).length >=
                                        stages_limit[v]
                                }
                                onClick={async () => {
                                    let d
                                    switch (v) {
                                        case CommissionPhaseT.revision:
                                            d = { type: v, done: false, count: 1 }
                                            break;
                                    
                                        default:
                                            d = { type: v, done: false }
                                            break;
                                    }
                                    set_stages(
                                        useCommissionStore.actions.process_stages_collections(
                                            [
                                                ...stages,
                                                d,
                                            ]
                                        )
                                    )
                                    set_dirty(true)
                                }}>
                                <Icon className="mr-1" icon="plus" />
                                {get_name(v)}
                                <Whisper
                                    placement="top"
                                    trigger="focus"
                                    speaker={
                                        <Popover title={get_name(v)}>
                                            <p>{get_help(v)}</p>
                                        </Popover>
                                    }
                                    >
                                    <a href="#" onClick={ev => {ev.stopPropagation(); ev.preventDefault()}} className="ml-2 unstyled"><Icon size="lg" icon="question2"/></a>
                                    </Whisper>
                            </Button>
                        </span>
                    ))}
                </List.Item>
            </List>
            <List className="w-128" sortable onSort={handleSortEnd}>
                {stages.map((v, idx) => (
                    <List.Item
                        index={idx}
                        collection={collections[v.type]}
                        disabled={
                            accepted ||
                            ([
                                'complete',
                                'pending_approval',
                                'unlock',
                            ] as CommissionPhaseType[]).includes(v.type)
                        }
                        key={v.type + idx.toString()}>
                        {!accepted && addable_stages.includes(v.type) && (
                            <a
                                href="#"
                                onClick={ev => {
                                    ev.preventDefault()
                                    let s = stages.slice()
                                    s.splice(idx, 1)
                                    set_stages(s)
                                    set_dirty(true)
                                }}>
                                <Icon className="mr-2" icon="minus-circle" />
                            </a>
                        )}
                        {`${idx+1}. `} {get_name(v.type)}
                        {v.count !== undefined && <CountTagEdit value={v.count} onChange={n => {
                            const s = [...stages]
                            s.splice(idx, 1, {...v, count: n})
                            set_stages(s)
                            set_dirty(true)
                        }}/> }
                    </List.Item>
                ))}
            </List>
            {<Button className="mt-2" appearance={dirty ? "primary" : "default"} disabled={!dirty} onClick={() => {
                set_dirty(false)
                update(stages)
            }}>{t`Update`}</Button>}
        </EditGroup>
    )
}

export const ReceiveMessage = () => {
    const store = useUserStore()

    const popover = (title, content) => (
        <Whisper
            speaker={<Popover title={title}>{content}</Popover>}
            placement="top"
            trigger="focus">
            <IconButton size="xs" icon={<Icon icon="question2" />} />
        </Whisper>
    )

    return (
        <EditGroup>
            <span className="mr-2">{t`Receive messages from`}: </span>
            <RadioGroup
                name="messages_from"
                inline
                appearance="picker"
                defaultValue={
                    store.state.current_user.messages_from
                }
                onChange={async v => {
                    let r = await store.update_user({ messages_from: v })
                }}>
                <Radio id="message_everyone"  value="everyone">
                    {t`Everyone`}{' '}
                </Radio>
                <Radio id="message_followers"  value="followers">
                    {t`Followers`}{' '}
                    {popover(
                        t`Followers`,
                        <p>{t`Only your followers can message you`}</p>
                    )}
                </Radio>
                <Radio id="message_commissioners"  value="commissioners">
                    {t`Commissioners`}{' '}
                    {popover(
                        t`Commissioners`,
                        <p>{t`Only your clients can message you`}</p>
                    )}
                </Radio>
            </RadioGroup>
            <HelpBlock className="my-2">{t`Who can message you?`}</HelpBlock>
        </EditGroup>
    )
}

export const Rates = () => {
    const [show_new_rate, set_show_new_rate] = useState(false)

    const [edit_rate, set_edit_rate] = useState()

    return (
        <React.Fragment>
            {show_new_rate && (
                <EditGroup>
                    <CommissionRateForm
                        panel
                        defaultData={edit_rate}
                        onDone={() => {
                            set_show_new_rate(false)
                            set_edit_rate(undefined)
                        }}
                    />
                </EditGroup>
            )}
            <EditGroup>
                <Grid fluid>
                    <CommissionTiersRow
                        addPlaceholder={!show_new_rate}
                        onAddClick={ev => {
                            ev.preventDefault()
                            set_show_new_rate(true)
                        }}
                        onClick={(data, ev) => {
                            ev.preventDefault()
                            set_edit_rate(data)
                            set_show_new_rate(true)
                        }}
                    />
                </Grid>
            </EditGroup>
        </React.Fragment>
    )
}


const RequestLimitDeadline = () => {
    const store = useUserStore()

    const update = useCallback(
        debounce((v: number, ev) => {
            store.update_user({ request_expire_deadline: Math.round(v) })
        }, 400),
        []
    )

    return (
        <EditGroup>
            <span className="mr-2">{t`Auto-decline requests in`}: </span>
            <div className="w-32">
                <InputNumber
                    defaultValue={store.state.current_user.request_expire_deadline}
                    min={0}
                    postfix={t`days`}
                    onChange={update}
                />
            </div>
            <HelpBlock className="mt-1">{t`Your current commission requests will automatically be declined if they have passed the given limit`}</HelpBlock>
        </EditGroup>
    )
}

export const CommissionMessage = () => {
    return (
        <EditGroup>
            <TextEditor />
        </EditGroup>
    )
}

export const CommissionAcceptMessage = () => {
    return (
        <EditGroup>
            <Placeholder.Paragraph rows={5} />
        </EditGroup>
    )
}

const CommissionsSettings = () => {
    return (
        <Grid fluid>
            
            <h4>{t`General`}</h4>
            <EditSection>
                <ReceiveMessage/>
                <RequestLimitDeadline/>
            </EditSection>

            <h4>{t`Rates`}</h4>
            <EditSection>
                <Rates />
            </EditSection>

            <h4>{t`Extra options`}</h4>
            <EditSection>
                <h5>{t`Additions`}</h5>
                <EditGroup>
                    <RateOptionsForm />
                </EditGroup>
                <h5>{t`Custom Agreements`}</h5>
                <EditGroup>
                    <LicenseForm />
                </EditGroup>
            </EditSection>

            <h4>{t`Process`}</h4>
            <EditSection>
                <CommissionProcess />
            </EditSection>

            <h4>{t`Limits`}</h4>
            <EditSection>
                <CommissionLimit />
                <CommissionRequestLimit />
            </EditSection>

            <h4>{t`Guidelines`}</h4>
            <EditSection>
                <EditGroup>
                    <CommissionGuideline />
                </EditGroup>
            </EditSection>
        </Grid>
    )
}

export default CommissionsSettings
