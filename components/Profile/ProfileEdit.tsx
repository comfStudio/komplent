import React, { useState } from 'react';
import { Grid, Row, Col, Checkbox, CheckboxGroup, FormGroup, ControlLabel, Button, RadioGroup, Radio, TagPicker, List, SelectPicker, InputNumber, Form, Toggle, Input } from 'rsuite';

import { t } from '@app/utility/lang'
import { CommissionCard, CommissionTiersRow } from '@components/Profile/ProfileCommission';
import Placeholder from '@components/App/Placeholder';
import { EditSection, EditGroup } from '@components/Settings'
import CommissionRateForm, { RateOptionsForm } from '@components/Form/CommissionRateForm'

import './ProfileEdit.scss'
import { useSessionStorage } from 'react-use';
import { useSettings, useUser } from '@hooks/user';
import { useUpdateDatabase } from '@hooks/db';
import { user_settings_schema } from '@schema/user';
import useUserStore from '@store/user';


export const Sections = () => {
    return (
        <EditGroup title={t`Sections`}>
            <CheckboxGroup inline name="sections">
            <Checkbox checked disabled>{t`About`}</Checkbox>
            <Checkbox checked disabled>{t`Rates`}</Checkbox>
            <Checkbox>{t`Reviews`}</Checkbox>
            <Checkbox>{t`Recommendations`}</Checkbox>
            <Checkbox>{t`Qoutes`}</Checkbox>
            <Checkbox>{t`Gallery`}</Checkbox>
            <Checkbox>{t`Shop`}</Checkbox>
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

    const [settings, update_settings] = useSettings()
    
    const value = (settings && settings.commissions_open) ? 'open' : 'closed'

    return (
        <React.Fragment>
            <EditGroup>
                <span className="mr-2">{t`Commission Status`}: </span>
                <RadioGroup name="commission_status" inline appearance="picker" defaultValue={value} onChange={(v) => {
                    if (settings) {
                        settings.commissions_open = v == 'open' ? true : false
                        update_settings(settings)
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

export const Notice = () => {

    const store = useUserStore()
    const [settings, update_settings] = useSettings()
    const [ notice_text, set_notice_text ] = useState(store.state.current_user.notice || "")
    const [ loading, set_loading ] = useState(false)
    const [ updated, set_updated ] = useState(false)
    const value = (settings && settings.notice_visible) ? "visible" : "hidden"

    return (
        <React.Fragment>
            <EditGroup>
                <span className="mr-2">{t`Notice Visibility`}: </span>
                <RadioGroup name="notice_visible" inline appearance="picker" defaultValue={value} onChange={(v) => {
                    if (settings) {
                        settings.notice_visible = v == 'visible'
                        update_settings(settings) 
                    }
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

export const CommissionLimit = () => {
    return (
    <EditGroup title={t`Maximum amount of on-going commissions` + ':'}>
        <div className="w-32">
            <InputNumber defaultValue="3"/>
        </div>
    </EditGroup>
    )
}

export const CommissionRequestLimit = () => {
    return (
    <EditGroup title={t`Maximum amount of on-going requests` + ':'}>
        <div className="w-32">
            <InputNumber defaultValue="10"/>
        </div>
    </EditGroup>
    )
}

export const ModificationNumber = () => {
    return (
    <EditGroup title={t`Number of modifications allowed` + ':'}>
        <div className="w-32">
            <InputNumber defaultValue="3"/>
        </div>
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
  
export const ProfileVisiblity = () => {
    return (
        <EditGroup>
            <span className="mr-2">{t`Profile Visiblity`}: </span>
            <RadioGroup name="profile_visiblity" inline appearance="picker" defaultValue="public">
            <Radio value="public">{t`Public`}</Radio>
            <Radio value="private">{t`Private`}</Radio>
            <Radio value="hidden">{t`Hidden`}</Radio>
            </RadioGroup>
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

export const CommissionGuideline = () => {

    return (
        <React.Fragment>
            <EditGroup title={t`Will draw`}>
                <EditSection>
                <List className="w-64">
                <List.Item key="">OCs</List.Item>
                </List>
                </EditSection>
            </EditGroup>
            <EditGroup title={t`Will not draw`}>
                <EditSection>
                <List className="w-64">
                <List.Item key="">NSFW</List.Item>
                </List>
                </EditSection>
            </EditGroup>
        </React.Fragment>
    )
}

export const Rates = () => {

    const [ show_new_rate, set_show_new_rate ] = useSessionStorage("new-commission-rate-form-show", false)

    return (
        <React.Fragment>
            {!show_new_rate && <Button onClick={(ev) => {ev.preventDefault(); set_show_new_rate(true);}}>{t`Add new rate`}</Button>}
            {show_new_rate && <EditGroup>
                            <CommissionRateForm panel onDone={() => {set_show_new_rate(false);}}/>
                        </EditGroup>}
            <EditGroup>
                <Grid fluid>
                    <CommissionTiersRow/>
                </Grid>
            </EditGroup>
        </React.Fragment>
    )
}

export const CommissionMessage = () => {
    return (
        <EditGroup>
            <Placeholder type="text" rows={8}/>
        </EditGroup>
    )
}

export const CommissionAcceptMessage = () => {
    return (
        <EditGroup>
            <Placeholder type="text" rows={5}/>
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

            <h3>{t`Commission`}</h3>
            <EditSection>
                <CommissionLimit/>
                <CommissionRequestLimit/>
                <ModificationNumber/>
            </EditSection>

            <h4>{t`Guidelines`}</h4>
            <EditSection>
                <EditGroup>
                    <CommissionGuideline/>
                </EditGroup>
            </EditSection>

            <h4>{t`Extras`}</h4>
            <EditSection>
                <EditGroup>
                    <RateOptionsForm/>
                </EditGroup>
            </EditSection>

            <h4>{t`Rates`}</h4>
            <EditSection>
                <Rates/>
            </EditSection>
            
            <h4>{t`Message`}</h4>
            <EditSection>
                <CommissionMessage/>
            </EditSection>

            <h4>{t`Request Accept Message`}</h4>
            <EditSection>
                <CommissionAcceptMessage/>
            </EditSection>
        </Grid>
    );
};

export default ProfileEdit;