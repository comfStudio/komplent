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
            store.update({ commission_deadline: v })
        }, 400),
        []
    )

    return (
        <EditGroup>
            <span className="mr-2">{t`Deadline`}: </span>
            <div className="w-32">
                <InputNumber
                    defaultValue={commission.commission_deadline}
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
            store.update_user({ ongoing_commissions_limit: v })
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
            store.update_user({ ongoing_requests_limit: v })
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
                    <EditGroup key={gtype} title={titles(gtype)}>
                        <EditSection>
                            <List className="w-64">
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
    const [stages, set_stages] = useState(def_stages)
    const prev_stages = useRef(stages)

    const get_name = (v: CommissionPhaseType) => {
        switch (v) {
            case 'pending_approval':
                return t`Approval`
            case 'pending_sketch':
                return t`Initial Sketch`
            case 'pending_payment':
                return t`Request Payment`
            case 'pending_product':
                return t`Commission Product`
            case 'revision':
                return t`Allow Revision`
            case 'complete':
                return t`Commission Complete`
            case 'unlock':
                return t`Unlock Product Access`
        }
    }

    const collections = useCommissionStore.actions.get_stages_collections()

    const mounted = useMountedState()

    const update = debounce(data => {
        data = useCommissionStore.actions.process_stages(data)
        if (
            !(
                data.length === prev_stages.current.length &&
                data.every((v, i) => prev_stages[i]?.type === v.type)
            )
        ) {
            prev_stages.current = data
            if (props.commission) {
                comm_store.update({ commission_process: data })
            } else {
                user_store.update_user({ commission_process: data })
            }
        }
    }, 500)

    useEffect(() => {
        if (mounted) {
            update(stages)
        }
    }, [stages])

    const handleSortEnd = ({ oldIndex, newIndex }) => {
        const move_data = stages.splice(oldIndex, 1)
        const new_data = [...stages]
        new_data.splice(newIndex, 0, move_data[0])
        set_stages(useCommissionStore.actions.process_stages(new_data))
    }

    const stages_limit = useCommissionStore.actions.get_stages_limits()

    const addable_stages: CommissionPhaseType[] = [
        CommissionPhaseT.pending_payment,
        CommissionPhaseT.pending_product,
        CommissionPhaseT.pending_sketch,
        CommissionPhaseT.revision,
    ]

    return (
        <EditGroup>
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
                                onClick={() => {
                                    set_stages(
                                        useCommissionStore.actions.process_stages(
                                            [
                                                ...stages,
                                                { type: v, done: false },
                                            ]
                                        )
                                    )
                                }}>
                                <Icon className="mr-1" icon="plus" />
                                {get_name(v)}
                            </Button>
                        </span>
                    ))}
                </List.Item>
            </List>
            <List className="w-64" sortable onSort={handleSortEnd}>
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
                                }}>
                                <Icon className="mr-2" icon="minus-circle" />
                            </a>
                        )}
                        {get_name(v.type)}
                    </List.Item>
                ))}
            </List>
        </EditGroup>
    )
}

export const Rates = () => {
    const [show_new_rate, set_show_new_rate] = useState(false)

    const [edit_rate, set_edit_rate] = useState()

    return (
        <React.Fragment>
            {!show_new_rate && (
                <Button
                    onClick={ev => {
                        ev.preventDefault()
                        set_show_new_rate(true)
                    }}>{t`Add new rate`}</Button>
            )}
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
                <h5>{t`Custom Licenses`}</h5>
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
