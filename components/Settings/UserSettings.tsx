import React, { useState } from 'react'
import { Grid, RadioGroup, Radio, SelectPicker, Button, Icon } from 'rsuite'
import { EditGroup, EditSection } from '.'

import { t } from '@app/utility/lang'
import useUserStore from '@store/user'
import { getCountryNames } from '@client/dataset'
import Upload from '@components/App/Upload'

export const UserType = () => {
    return (
        <EditGroup>
            <span className="mr-2">{t`Type of user`}: </span>
            <RadioGroup
                name="user_type"
                inline
                appearance="picker"
                defaultValue="consumer">
                <Radio value="consumer">{t`Consumer`}</Radio>
                <Radio value="creator">{t`Creator`}</Radio>
            </RadioGroup>
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
                className="ml-2"
                style={{ width: 300 }}
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
            <SelectPicker data={[]} className="ml-2" style={{ width: 300 }} />
        </EditGroup>
    )
}

export const UserAvatar = () => {

    const store = useUserStore()
    const [avatar_changed, set_avatar_changed] = useState(false)

    return (
        <Upload autoUpload hideFileList onUpload={(res) => {
                    store.update_user({avatar: res?.data}).then(r => set_avatar_changed(r.status))
                }}>
                    {avatar_changed ? <Button><Icon icon="check" size="3x"/></Button> : <Button>{t`Avatar`}</Button>}
        </Upload>
    )
}

const UserSettings = () => {
    return (
        <Grid fluid>
            <h4>{t`General`}</h4>
            <EditSection>
                <UserAvatar/>
                <Location />
            </EditSection>
            {/* <h4>{t`Site`}</h4>
            <EditSection>
                <Theme />
            </EditSection> */}
            <h4>{t`Integrations`}</h4>
            <EditSection>
                
            </EditSection>
            <h4>{t`Account`}</h4>
            <EditSection>
                <UserType />
                <Button
                    appearance="ghost"
                    color="red">{t`Delete account`}</Button>
            </EditSection>
        </Grid>
    )
}

export default UserSettings
