import React, { useState } from 'react';
import { Button, Panel, Progress } from 'rsuite';

import { ProfileNameTag } from '@components/Profile'
import { Tag, TagGroup } from '@components/Profile/Tag'
import { useProfileUser, useUser } from '@hooks/user'
import { t } from '@app/utility/lang'

import { HTMLElementProps } from '@utility/props'

const { Circle } = Progress

import './ProfileInfo.scss'
import { useUpdateDatabase } from '@hooks/db';
import { useTagStore } from '@store/user';
import { get_profile_name } from '@utility/misc';
import { codeToCountryName } from '@client/dataset';

interface Props extends HTMLElementProps {

}

export const ProfileInfo = (props: Props) => {
    const { current_user, profile_user, context: { profile_owner } } = useProfileUser()
    const store = useTagStore()
    const [tags, set_tags] = useState(profile_user.tags)
    let cls = "w-64"
    return (
        <Panel id="profile-info" className={props.className ? cls + ' ' + props.className : cls} bordered>
            <p>
                <ProfileNameTag name={get_profile_name(profile_user)}/>
            </p>
            <p>
                <TagGroup edit={profile_owner} filteredTagIds={tags.map(v => v._id)} onChange={a => {
                    let t = store.state.tags.filter(v => a.includes(v._id))
                    set_tags([...tags, ...t])
                    store.add_user_tags(profile_user, t)
                    }}>
                    {tags.map(t => {
                        return (
                            <Tag key={t._id} closable={profile_owner} onClose={ev => {
                                ev.preventDefault()
                                store.remove_user_tag(profile_user, t._id)
                                set_tags(tags.filter(ot => t._id !== ot._id))
                            }} color={t.color}>{t.name}</Tag>
                        )
                    })}
                </TagGroup>
            </p>
            <hr/>
            <p>
                <strong>{t`Commission details`}:</strong>
                <p>
                    <table className="w-full">
                        <tbody>
                        <tr className="border-t border-b">
                        <td>{t`Approval rate`}:</td>
                        <td>100%</td>
                        </tr>
                        <tr className="border-t border-b">
                        <td>{t`Approval time`}:</td>
                        <td>1 day</td>
                        </tr>
                        <tr className="border-t border-b">
                        <td>{t`Completion time`}:</td>
                        <td>3 days</td>
                        </tr>
                        <tr className="border-t border-b">
                        <td>{t`Completion rate`}:</td>
                        <td>100%</td>
                        </tr>
                        <tr className="border-t border-b">
                        <td>{t`Total`}:</td>
                        <td>25</td>
                        </tr>
                        </tbody>
                    </table>
                </p>
            </p>
            <p>
                <strong>{t`Location`}:</strong>
                <p>
                    {profile_user.country ? codeToCountryName(profile_user.country) : t`Unknown`}
                </p>
            </p>
            <p>
                <strong>{t`Socials`}:</strong>
                <p>
                    <ul className="list-disc">
                    {profile_user.socials.map((v, idx) => {
                        let u = v.url
                        let is_link = false
                        const matches = v.url.match(/^(?:https?:)?(?:\/\/)?(?:www\.)?([^/?]+)/i)
                        if (matches && matches[1]) {
                            u = matches[1]
                            is_link = true
                        }
                        return (
                        <li key={v.name + idx.toString()}>
                            {is_link && <> <a href={v.url}>{v.name}</a><span className="muted">@{u}</span> </>}
                            {!is_link && <> {v.name}<span className="muted">@{u}</span> </>}
                        </li>)
                    })}
                    </ul>
                </p>
            </p>
            <div className="text-center">
                <Button appearance="subtle" size="sm">{t`Report`}</Button>
            </div>
        </Panel>
    );
}

export default ProfileInfo;