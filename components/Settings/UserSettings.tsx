import React, { useState, useEffect } from 'react'
import { Grid, RadioGroup, Radio, SelectPicker, Button, Icon, List, CheckboxGroup, Toggle, InputGroup, Input, Modal, Checkbox, Whisper, Popover, IconButton, HelpBlock } from 'rsuite'
import { useRouter } from 'next/router'
import { useMount } from 'react-use'

import { EditGroup, EditSection } from '.'
import { t } from '@app/utility/lang'
import useUserStore from '@store/user'
import { getCountryNames } from '@client/dataset'
import Upload from '@components/App/Upload'
import { ProfileNSFWLevel } from '@components/Profile/ProfileEdit'
import InputGroupAddon from 'rsuite/lib/InputGroup/InputGroupAddon'
import { username_validate, email_validate, password_validate } from '@components/Form/JoinForm'
import { fetch } from '@utility/request'
import { oauth_window } from '@client/misc'
import { UploadType } from '@server/constants'
import { useUser } from '@hooks/user'
import * as pages from '@utility/pages'

export const UserType = () => {
    const router = useRouter()
    const store = useUserStore()
    const [creator_loading, set_creator_loading] = useState(false) 
    const [consumer_loading, set_consumer_loading] = useState(false)

    return (
        <EditGroup title={t`Creator mode` + ':'}>
            <span className="ml-2">
                {store.state.current_user.type === 'consumer' && <Button onClick={ev => {
                    ev.preventDefault()
                    set_creator_loading(true)
                    store.update_user({type: "creator"}).then(() => {
                        set_creator_loading(false)
                        router.push(pages.make_profile_urlpath(store.state.current_user))
                    })
                }} loading={creator_loading} appearance="primary">{t`Setup your page`}</Button>}
                {store.state.current_user.type === 'creator' && <Button onClick={ev => {
                    ev.preventDefault()
                    set_consumer_loading(true)
                    store.update_user({type: "consumer"}).then(() => set_consumer_loading(false))
                }} loading={consumer_loading} appearance="ghost">{t`Disable your page`}</Button>}
            </span>
        </EditGroup>
    )
}

export const Location = () => {
    const store = useUserStore()

    let ct = store.state.current_user?.country

    return (
        <EditGroup title={t`Location` + ':'}>
            <SelectPicker
                data={Object.entries(getCountryNames()).map(l => ({
                    value: l[0],
                    label: l[1],
                }))}
                defaultValue={ct}
                onSelect={v => store.update_user({ country: v })}
                className="ml-2 w-96"
            />
        </EditGroup>
    )
}

export const Theme = () => {
    return (
        <EditGroup>
            <span className="mr-2">{t`Theme`}: </span>
            <RadioGroup
                name="user_type"
                inline
                appearance="picker"
                defaultValue="light">
                <Radio value="light">{t`Light`}</Radio>
                <Radio value="dark">{t`Dark`}</Radio>
            </RadioGroup>
        </EditGroup>
    )
}

export const Currency = () => {
    return (
        <EditGroup title={t`Currency` + ':'}>
            <SelectPicker data={[]} className="ml-2 w-64" />
        </EditGroup>
    )
}

export const CommissionAnonymously = () => {

    const store = useUserStore()

    return (
        <EditGroup>
            <Checkbox defaultChecked={store.state.current_user.anonymous} onChange={(_, v) => store.update_user({anonymous: v})}>{t`Always commission anonymously`}</Checkbox>
        </EditGroup>
    )
}

export const UserAvatar = () => {

    const store = useUserStore()
    const [avatar_changed, set_avatar_changed] = useState(false)

    return (
        <Upload autoUpload hideFileList uploadType={UploadType.ProfilePicture} onUpload={(res) => {
                    store.update_user({avatar: res?.data}).then(r => set_avatar_changed(r.status))
                }}>
                    {avatar_changed ? <Button><Icon icon="check" size="3x"/></Button> : <Button>{t`Avatar`}</Button>}
        </Upload>
    )
}

export const Notifications = () => {
    return (
        <EditGroup>
            <List>
                <List.Item><Toggle/> {t`Commission updates`}</List.Item>
                <List.Item><Toggle/> {t`Creator opens for commissions`}</List.Item>
                <List.Item><Toggle/> {t`New follower`}</List.Item>
            </List>
        </EditGroup>
    )
}

export const Integrations = () => {

    const store = useUserStore()

    const [show_pass_modal, set_show_pass_modal] = useState(false)

    let auth_data = {}
    store.state.current_user?.oauth_data?.map(v => { auth_data[v.provider] = v })

    const providers = [
        {provider: 'google', icon: <Icon icon="google"/>, name: t`Google`, linked: !!auth_data['google'], link_name: auth_data['google']?.info?.names?.[0]?.displayName},
        {provider: 'facebook', icon: <Icon icon="facebook-official"/>, name: t`Facebook`, linked: !!auth_data['facebook'], link_name: auth_data['facebook']?.info?.name},
        {provider: 'twitter', icon: <Icon icon="twitter"/>, name: t`Twitter`, linked: !!auth_data['twitter'], link_name: auth_data['twitter']?.info?.screen_name ? `${auth_data['twitter']?.info?.name} (@${auth_data['twitter']?.info?.screen_name})` : undefined},
        // {provider: 'instagram', icon: <Icon icon="instagram"/>, name: t`Instagram`, linked: !!auth_data['instagram'], link_name: auth_data['instagram']?.info?.names?.[0]?.displayName},
        // {provider: 'pixiv', icon: <Icon icon="globe"/>, name: t`Pixiv`, linked: !!auth_data['pixiv'], link_name: auth_data['pixiv']?.info?.names?.[0]?.displayName},
    ]

    const link = url => {
        oauth_window(url, location.origin, (msg) => {
            if (msg.data === 'refresh') {
                location.reload()
            }
        })
    }

    return (
        <EditGroup>
            <Modal backdrop show={show_pass_modal} onHide={() => { set_show_pass_modal(false) }}>
                <Modal.Header> <Modal.Title>{t`Set a password before unlinking`}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Password show_inputs done={() => { set_show_pass_modal(false) }}/>
                </Modal.Body>
            </Modal>
            {providers.map(v => 
                <div key={v.provider} className="mb-4">
                    {v.icon} 
                    <span className="mr-2">
                        {v.name}: {v.linked ? 
                        <><span className="text-primary">{v.link_name}</span> <Button onClick={() => {
                            fetch("/api/auth/unlink", {
                                method: "post",
                                body: { provider: v.provider }
                            }).then(r => {
                                if (r.ok) {
                                    location.reload()
                                } else {
                                    r.json().then(d => {
                                        if (d && d.error) {
                                            if (d.error.includes("password")) {
                                                set_show_pass_modal(true)
                                            }
                                        }
                                    })
                                }
                            })
                        }} appearance="ghost" size="xs">{t`Unlink`}</Button> </>
                        : <Button onClick={() => {link(`/api/auth/${v.provider}`)}} appearance="ghost" size="xs">{t`Link`}</Button>}
                    </span>
                </div>
            )}
        </EditGroup>
    )
}

export const Username = () => {
    const store = useUserStore()

    const [username, set_username] = useState(store.state.current_user?.username)
    const [error, set_error] = useState("")

    return (
        <EditGroup margin title={t`Username` + ':'}>
            <InputGroup className="!w-128">
            <InputGroupAddon>@</InputGroupAddon>
            <Input value={username} onChange={v => {
                const r = username_validate.check(v, {})
                set_username(v);
                if (r.hasError) {
                    set_error(r.errorMessage)
                } else {
                    set_error("")
                }
                }}/>
                {!!!error && username.length > 1 && username != store.state.current_user?.username &&
                <InputGroup.Button appearance="primary" onClick={() => {
                    store.update_user_creds({ username }).then(r => {
                        if (!r.ok) {
                            set_error(t`An error occurred, try again with another username`)
                        }
                    }) }}>{t`Update`}</InputGroup.Button>
                }
            </InputGroup>
            {error && <p className="text-red-500">{error}</p>}
        </EditGroup>
    )
}

export const Email = () => {
    const store = useUserStore()

    const [email, set_email] = useState(store.state.current_user?.email)
    const [error, set_error] = useState("")


    return (
        <EditGroup margin title={t`Email` + ':'}>
            <InputGroup className="!w-128">
            <Input value={email} onChange={v => {
                const r = email_validate.check(v, {})
                set_email(v);
                if (r.hasError) {
                    set_error(r.errorMessage)
                } else {
                    set_error("")
                }
            }}/>
                {!!!error && email.length > 1 && email != store.state.current_user?.email &&
                <InputGroup.Button appearance="primary" onClick={() => {
                    store.update_user_creds({ email }).then(r => {
                        if (!r.ok) {
                            set_error(t`An error occurred, try again with another email`)
                        }
                    }) }}>{t`Update`}</InputGroup.Button>
                }
            </InputGroup>
            {error && <p className="text-red-500">{error}</p>}
        </EditGroup>
    )
}

export const Password = ({show_inputs = false, done}: {show_inputs?: boolean, done?: Function}) => {
    const store = useUserStore()

    const [show, set_show] = useState(show_inputs)
    const [has_password, set_has_password] = useState(true)
    const [old_password, set_old_password] = useState("")
    const [password_1, set_password_1] = useState("")
    const [password_2, set_password_2] = useState("")
    const [error, set_error] = useState("")
    const [error_3, set_error_3] = useState("")
    const [error_2, set_error_2] = useState("")

    useEffect(() => {
        set_show(show_inputs)
        set_password_1("")
        set_password_2("")
        fetch("/api/misc", {method: 'post', body: {has_password: true}}).then(async r => {
            if (r.ok) {
                set_has_password((await r.json())?.data?.has_password)
            }
        })
    }, [store.state.current_user?.password])

    useEffect(() => {
        if (password_1 === password_2) {
            set_error_2("")
        } else {
            set_error_2(t`The two passwords do not match`)
        }
    }, [password_1])

    useEffect(() => {
        set_error_3("")
    }, [password_1, password_2, old_password])

    return (
        <EditGroup margin title={t`Password` + ':'}>
            {!show && <Button onClick={() => { set_show(true) }}>{t`Change password`}</Button>}
            {show && <>
                {has_password && 
                <div className="mb-2 w-128">
                    <Input placeholder={t`Old password`} type="password" onChange={v => {
                        set_old_password(v);
                    }}/>
                </div>
                }
                <div className="mb-2 w-128">
                    <Input placeholder={t`New password`} type="password" value={password_2} onChange={v => {
                        const r = password_validate.check(v, {})
                        set_password_2(v);
                        if (r.hasError) {
                            set_error(r.errorMessage)
                        } else {
                            set_error("")
                        }
                    }}/>
                </div>
                <InputGroup className="!w-128">
                <Input placeholder={t`Repeat new password`} type="password" value={password_1} onChange={v => {
                    set_password_1(v);
                }}/>
                    {!!!error && !!!error_2 && !!!error_3 && password_1.length > 1 && (!has_password || old_password.length > 1) &&
                    <InputGroup.Button appearance="primary" onClick={() => {
                        store.update_user_creds({ password: password_1, old_password }).then(r => {
                            if (!r.ok) {
                                set_error_3(t`An error occurred, try again`)
                            } else {
                                if (done) {
                                    done()
                                }
                            }
                        }) }}>{t`Update`}</InputGroup.Button>
                    }
                </InputGroup>
                {error && <p className="text-red-500">{error}</p>}
                {error_2 && <p className="text-red-500">{error_2}</p>}
                {error_3 && <p className="text-red-500">{error_3}</p>}
            </>}
        </EditGroup>
    )
}

const UserSettings = () => {

    return (
        <Grid fluid>
            <h4>{t`General`}</h4>
            <EditSection>
                <UserAvatar/>
                <Location />
                <ProfileNSFWLevel text={t`Show mature content`} key='show_nsfw' only_show />
                {/* <CommissionAnonymously/> */}
            </EditSection>
            {/* <h4>{t`Site`}</h4>
            <EditSection>
                <Theme />
            </EditSection> */}
            <h4>{t`Integrations`}</h4>
            <EditSection>
                <Integrations/>
            </EditSection>
            <h4>{t`Email Notifications`}</h4>
            <EditSection>
                <Notifications/>
            </EditSection>
            <h4>{t`Account`}</h4>
            <EditSection>
                <UserType />
                <Username/>
                <Email/>
                <Password/>
                <Button
                    appearance="ghost"
                    color="red">{t`Delete account`}</Button>
            </EditSection>
        </Grid>
    )
}

export default UserSettings
