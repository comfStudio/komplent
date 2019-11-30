import React, { useState } from 'react'
import {
    Grid,
    Row,
    Col,
    Checkbox,
    CheckboxGroup,
    FormGroup,
    ControlLabel,
    Button,
    RadioGroup,
    Radio,
    TagPicker,
    List,
    SelectPicker,
    InputNumber,
    Form,
    Toggle,
    Input,
    Whisper,
    IconButton,
    Popover,
    Icon,
    InputGroup,
} from 'rsuite'

import { t } from '@app/utility/lang'
import {
    CommissionCard,
    CommissionTiersRow,
} from '@components/Profile/ProfileCommission'
import { EditSection, EditGroup } from '@components/Settings'
import CommissionRateForm, {
    RateOptionsForm,
} from '@components/Form/CommissionRateForm'

import './ProfileEdit.scss'
import { useSessionStorage } from 'react-use'
import { useUser, useProfileUser } from '@hooks/user'
import { useUpdateDatabase } from '@hooks/db'
import useUserStore from '@store/user'
import { post_task, TaskMethods, post_task_debounce } from '@client/task'
import { TASK, NSFW_LEVEL } from '@server/constants'
import TextEditor from '@components/App/TextEditor'
import { getCountryNames } from '@client/dataset'
import MessageText from '@components/App/MessageText'
import Upload from '@components/App/Upload'
import { UserAvatar } from '@components/Settings/UserSettings'

export const Sections = () => {
    return (
        <EditGroup title={t`Sections`}>
            <CheckboxGroup inline name="sections">
                <Checkbox checked disabled>{t`About`}</Checkbox>
                <Checkbox checked disabled>{t`Rates`}</Checkbox>
                <Checkbox>{t`Gallery`}</Checkbox>
                {/* <Checkbox>{t`Reviews`}</Checkbox>
            <Checkbox>{t`Recommendations`}</Checkbox>
            <Checkbox>{t`Qoutes`}</Checkbox>
            <Checkbox>{t`Shop`}</Checkbox> */}
            </CheckboxGroup>
        </EditGroup>
    )
}

export const ProfileColor = () => {
    return <EditGroup title={t`Color`}></EditGroup>
}

export const ProfileCoverAvatar = () => {

    const store = useUserStore()

    const [cover_changed, set_cover_changed] = useState(false)

    return <EditGroup>
        <Upload autoUpload hideFileList onUpload={(res) => {
                    store.update_user({profile_cover: res?.data}).then(r => set_cover_changed(r.status))
                }}>
                    {cover_changed ? <Button><Icon icon="check" size="3x"/></Button> : <Button>{t`Cover`}</Button>}
        </Upload>
        <UserAvatar/>
    </EditGroup>
}

export const CommissionStatus = () => {
    const store = useUserStore()
    const user = store.state.current_user

    const value = user.commissions_open ? 'open' : 'closed'

    return (
        <React.Fragment>
            <EditGroup>
                <span className="mr-2">{t`Commission Status`}: </span>
                <RadioGroup
                    name="commission_status"
                    inline
                    appearance="picker"
                    defaultValue={value}
                    onChange={async v => {
                        let status = v == 'open' ? true : false
                        let r = await store.update_user({
                            commissions_open: status,
                        })
                        if (r.status) {
                            post_task(TaskMethods.schedule_unique, {
                                key: user._id,
                                when: '2 minutes',
                                task: TASK.user_commission_status_changed,
                                data: { user_id: user._id, status },
                            })
                        }
                    }}>
                    <Radio value="open">{t`Open`}</Radio>
                    <Radio value="closed">{t`Closed`}</Radio>
                </RadioGroup>
            </EditGroup>
        </React.Fragment>
    )
}

export const ProfileVisiblity = () => {
    const store = useUserStore()

    return (
        <EditGroup>
            <span className="mr-2">{t`Profile Visiblity`}: </span>
            <RadioGroup
                name="profile_visiblity"
                inline
                appearance="picker"
                defaultValue={store.state.current_user.visibility || 'private'}
                onChange={async v => {
                    let r = await store.update_user({ visibility: v })
                }}>
                <Radio value="public">{t`Public`}</Radio>
                <Radio value="private">{t`Private`}</Radio>
                <Radio value="hidden">{t`Hidden`}</Radio>
            </RadioGroup>
        </EditGroup>
    )
}

export const ProfileNSFWLevel = () => {
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
            <span className="mr-2">{t`Mature content`}: </span>
            <RadioGroup
                name="profile_visiblity"
                inline
                appearance="picker"
                defaultValue={
                    store.state.current_user.nsfw || NSFW_LEVEL.level_0
                }
                onChange={async v => {
                    let r = await store.update_user({ nsfw: v })
                }}>
                <Radio value={NSFW_LEVEL.level_0}>{t`None`}</Radio>
                <Radio value={NSFW_LEVEL.level_5}>
                    {t`Moderate`}{' '}
                    {popover(
                        t`Moderate`,
                        <p>{t`Moderate Not-Safe-For-Work level`}</p>
                    )}
                </Radio>
                <Radio value={NSFW_LEVEL.level_10}>
                    {t`Explicit`}{' '}
                    {popover(
                        t`Explicit`,
                        <p>{t`Explicit Not-Safe-For-Work level`}</p>
                    )}
                </Radio>
            </RadioGroup>
        </EditGroup>
    )
}

export const Notice = () => {
    const store = useUserStore()
    const [notice_text, set_notice_text] = useState(
        store.state.current_user.notice || ''
    )
    const [loading, set_loading] = useState(false)
    const [updated, set_updated] = useState(false)
    const value = store.state.current_user.notice_visible ? 'visible' : 'hidden'

    return (
        <React.Fragment>
            <EditGroup>
                <span className="mr-2">{t`Public Message Visibility`}: </span>
                <RadioGroup
                    name="notice_visible"
                    inline
                    appearance="picker"
                    defaultValue={value}
                    onChange={v => {
                        let status = v == 'visible'
                        store
                            .update_user({ notice_visible: status })
                            .then(r => {
                                if (r.status && status) {
                                    post_task(TaskMethods.schedule_unique, {
                                        key: store.state.current_user._id,
                                        when: '1 minute',
                                        task: TASK.user_notice_changed,
                                        data: {
                                            user_id:
                                                store.state.current_user._id,
                                            message: notice_text,
                                        },
                                    })
                                }
                            })
                    }}>
                    <Radio value="visible">{t`Visible`}</Radio>
                    <Radio value="hidden">{t`Hidden`}</Radio>
                </RadioGroup>
                {value === 'visible' && (
                    <Button
                        loading={loading}
                        disabled={updated}
                        onClick={ev => {
                            ev.preventDefault()
                            set_loading(true)
                            store
                                .update_user({ notice: notice_text })
                                .then(r => {
                                    set_loading(false)
                                    if (r.status) set_updated(true)
                                })
                        }}
                        className="ml-2"
                        size="sm">{t`Update`}</Button>
                )}
            </EditGroup>
            {value === 'visible' && (
                <EditGroup>
                    <Input
                        onChange={v => {
                            set_notice_text(v)
                            set_updated(false)
                        }}
                        defaultValue={notice_text}
                        rows={3}
                        placeholder={t`Maximum of 250 words`}
                        componentClass="textarea"
                    />
                </EditGroup>
            )}
        </React.Fragment>
    )
}

function compare(a, b) {
    let nameA = a.toUpperCase()
    let nameB = b.toUpperCase()

    if (nameA < nameB) {
        return -1
    }
    if (nameA > nameB) {
        return 1
    }
    return 0
}

export const Tags = () => {
    return (
        <EditGroup title={t`Tags` + ':'}>
            <TagPicker
                data={[]}
                groupBy="role"
                sort={isGroup => {
                    if (isGroup) {
                        return (a, b) => {
                            return compare(a.groupTitle, b.groupTitle)
                        }
                    }

                    return (a, b) => {
                        return compare(a.value, b.value)
                    }
                }}
                style={{ width: 300 }}
                className="ml-2"
            />
        </EditGroup>
    )
}

export const Socials = () => {
    const store = useUserStore()

    const [link_name, set_link_name] = useState('')
    const [link_url, set_link_url] = useState('')
    const [add_new, set_add_new] = useState(false)

    const [data, set_data] = useState(store.state.current_user.socials ?? [])

    const handleSortEnd = ({ oldIndex, newIndex }) => {
        const moveData = data.splice(oldIndex, 1)
        const newData = [...data]
        newData.splice(newIndex, 0, moveData[0])
        store.update_user({ socials: [...newData] })
        set_data(newData)
    }

    const form_el = (name, set_name, url, set_url, on_submit) => (
        <form className="w-64" onSubmit={on_submit}>
            <Input
                className="my-2"
                placeholder={t`Name`}
                value={name}
                onChange={set_name}
                size="sm"
            />
            <InputGroup size="sm" className="my-2">
                <InputGroup.Addon> @</InputGroup.Addon>
                <Input
                    className="my-2"
                    placeholder={t`URL`}
                    value={url}
                    onChange={set_url}
                />
            </InputGroup>
            <Button
                type="submit"
                className="mb-2 float-right"
                size="sm">{t`Add`}</Button>
        </form>
    )

    return (
        <EditGroup title={t`Socials`}>
            <EditSection>
                <List className="w-64 mb-2" sortable onSort={handleSortEnd}>
                    {data.map(({ name, url }, index) => (
                        <List.Item key={index} index={index}>
                            <a
                                href="#"
                                onClick={ev => {
                                    ev.preventDefault()
                                    let new_data = data.slice()
                                    new_data.splice(index, 1)
                                    set_data(new_data)
                                    store.update_user({
                                        socials: [...new_data],
                                    })
                                }}>
                                <Icon className="mr-2" icon="minus-circle" />
                            </a>
                            {name} - <span className="muted">{url}</span>
                        </List.Item>
                    ))}
                </List>
                {add_new &&
                    form_el(
                        link_name,
                        set_link_name,
                        link_url,
                        set_link_url,
                        ev => {
                            ev.preventDefault()
                            if (link_name && link_url) {
                                let new_data = [
                                    ...data,
                                    { name: link_name, url: link_url },
                                ]
                                set_data(new_data)
                                store.update_user({ socials: new_data })
                                set_link_name('')
                                set_link_url('')
                                set_add_new(false)
                            }
                        }
                    )}
                {!add_new && (
                    <Button
                        size="sm"
                        onClick={() => set_add_new(true)}>{t`New`}</Button>
                )}
            </EditSection>
        </EditGroup>
    )
}

export const ProfileEdit = () => {
    return (
        <Grid fluid>
            <h4>{t`General`}</h4>
            <EditSection>
                <CommissionStatus />
                <ProfileVisiblity />
                <Notice />
                {/* <Sections/> */}
                {/* <ProfileColor/> */}
                {/* <Tags/> */}
                <ProfileNSFWLevel />
                <span>{t`Change Cover & Avatar:`}</span>
                <ProfileCoverAvatar/>
                <Socials />
            </EditSection>
            <h4>{t`About`}</h4>
            <EditSection>
                <MessageText message_key="about" maxLength={1000} />
            </EditSection>
        </Grid>
    )
}

export default ProfileEdit
