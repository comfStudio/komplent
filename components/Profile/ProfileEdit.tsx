import React, { useState } from 'react';
import { Grid, Row, Col, Checkbox, CheckboxGroup, FormGroup, ControlLabel, Button, RadioGroup, Radio, TagPicker, List, SelectPicker, InputNumber, Form, Toggle, Input } from 'rsuite';

import { t } from '@app/utility/lang'
import { CommissionCard, CommissionTiersRow } from '@components/Profile/ProfileCommission';
import Placeholder from '@components/App/Placeholder';
import { EditSection, EditGroup } from '@components/Settings'
import CommissionRateForm, { RateOptionsForm } from '@components/Form/CommissionRateForm'

import './ProfileEdit.scss'
import { useSessionStorage } from 'react-use';
import { useUser } from '@hooks/user';
import { useUpdateDatabase } from '@hooks/db';
import useUserStore from '@store/user';
import { post_task, TaskMethods, post_task_debounce } from '@client/task';
import { TASK } from '@server/constants';
import TextEditor from '@components/App/TextEditor';


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
    return (
        <EditGroup title={t`Color`}>
        </EditGroup>
    )
}

export const CommissionStatus = () => {

    const store = useUserStore()
    const user = store.state.current_user
    
    const value = (user.commissions_open) ? 'open' : 'closed'

    return (
        <React.Fragment>
            <EditGroup>
                <span className="mr-2">{t`Commission Status`}: </span>
                <RadioGroup name="commission_status" inline appearance="picker" defaultValue={value} onChange={async (v) => {
                    let status = v == 'open' ? true : false
                    let r = await store.update_user({commissions_open: status})
                    if (r.status) {
                        post_task(TaskMethods.schedule_unique, {key:user._id, when: "2 minutes", task: TASK.user_commission_status_changed, data: {user_id: user._id, status}})
                    }
                }}>
                <Radio value="open">{t`Open`}</Radio>
                <Radio value="closed">{t`Closed`}</Radio>
                </RadioGroup>
            </EditGroup>
            {value === 'open' &&
            <EditGroup >
                <Checkbox name="auto_manage_status">{t`Automatically close or open when above or below the maximum amount of requests`}</Checkbox>
            </EditGroup>
            }
        </React.Fragment>
    )
}

export const ProfileVisiblity = () => {

    const store = useUserStore()

    return (
        <EditGroup>
            <span className="mr-2">{t`Profile Visiblity`}: </span>
            <RadioGroup name="profile_visiblity" inline appearance="picker" defaultValue={store.state.current_user.visibility||"private"} onChange={async (v) => {
                    let r = await store.update_user({visibility: v})
                }}>
            <Radio value="public">{t`Public`}</Radio>
            <Radio value="private">{t`Private`}</Radio>
            <Radio value="hidden">{t`Hidden`}</Radio>
            </RadioGroup>
        </EditGroup>
    )
}

export const Notice = () => {

    const store = useUserStore()
    const [ notice_text, set_notice_text ] = useState(store.state.current_user.notice || "")
    const [ loading, set_loading ] = useState(false)
    const [ updated, set_updated ] = useState(false)
    const value = (store.state.current_user.notice_visible) ? "visible" : "hidden"

    return (
        <React.Fragment>
            <EditGroup>
                <span className="mr-2">{t`Public Message Visibility`}: </span>
                <RadioGroup name="notice_visible" inline appearance="picker" defaultValue={value} onChange={(v) => {
                    let status = v == 'visible'
                    store.update_user({notice_visible: status}).then(r => {
                        if (r.status && status) {
                            post_task(TaskMethods.schedule_unique, {key:store.state.current_user._id, when:"1 minute", task: TASK.user_notice_changed, data: {user_id: store.state.current_user._id, message:notice_text}})
                        }
                    })
                }}>
                <Radio value="visible">{t`Visible`}</Radio>
                <Radio value="hidden">{t`Hidden`}</Radio>
                </RadioGroup>
            { value === "visible" && <Button loading={loading} disabled={updated} onClick={ev => {ev.preventDefault(); set_loading(true); store.update_user({notice: notice_text}).then(r => {set_loading(false); if (r.status) set_updated(true)})}} className="ml-2" size="sm">{t`Update`}</Button> }
            </EditGroup>
            {value === "visible" &&
            <EditGroup >
                <Input onChange={v => {set_notice_text(v); set_updated(false)}} defaultValue={notice_text} rows={3} placeholder={t`Maximum of 250 words`} componentClass="textarea"/>
            </EditGroup>
            }
        </React.Fragment>
    )
}

function compare(a, b) {
    let nameA = a.toUpperCase();
    let nameB = b.toUpperCase();
  
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

export const Origin = () => {
    return (
    <EditGroup title={t`Origin` + ':'}>
        <SelectPicker data={[]} className="ml-2" style={{ width: 300 }}/>
    </EditGroup>
    )
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
              return compare(a.groupTitle, b.groupTitle);
            };
          }
  
          return (a, b) => {
            return compare(a.value, b.value);
          };
        }}
        style={{ width: 300 }}
        className="ml-2"
      />
    </EditGroup>
    )
}

export const Socials = () => {

    const [data, set_data] = useState([
        {text:'aTwiddly',},
        {text:'@twiddlyart',},
        {text:'Twiddli',},
      ])

    const handleSortEnd = ({oldIndex, newIndex}) => {
        const moveData=data.splice(oldIndex,1);
        const newData=[...data];
        newData.splice(newIndex,0,moveData[0]);
        set_data(newData)
      };

    return (
        <EditGroup title={t`Socials`}>
            <EditSection>
            <List className="w-64" sortable onSort={handleSortEnd}>
            {
            data.map(({text},index)=>
            <List.Item 
                key={index}
                index={index} 
            >
                {text}
            </List.Item>
            )
            }
            </List>
            </EditSection>
        </EditGroup>
    )
}

export const ProfileEdit = () => {
    return (
        <Grid fluid>
            <h4>{t`General`}</h4>
            <EditSection>
                <CommissionStatus/>
                <ProfileVisiblity/>
                <Notice/>
                <Sections/>
                <ProfileColor/>
                <Origin/>
                <Tags/>
                <Socials/>
            </EditSection>
        </Grid>
    );
};

export default ProfileEdit;