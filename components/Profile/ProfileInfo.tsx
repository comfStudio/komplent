import React, { useState, useEffect } from 'react'
import { Button, Panel, Progress } from 'rsuite'

import { ProfileNameTag } from '@components/Profile'
import { Tag, TagGroup } from '@components/Profile/Tag'
import { useProfileUser, useUser } from '@hooks/user'
import { t } from '@app/utility/lang'

import { HTMLElementProps } from '@utility/props'

const { Circle } = Progress

import './ProfileInfo.scss'
import { useUpdateDatabase } from '@hooks/db'
import { useTagStore } from '@store/user'
import { get_profile_name } from '@utility/misc'
import { codeToCountryName } from '@client/dataset'
import useProfileStore from '@store/profile'

interface Props extends HTMLElementProps {}

export const ProfileInfo = (props: Props) => {
    const {
        current_user,
        profile_user,
        context: { profile_owner },
    } = useProfileUser()

    const tag_store = useTagStore()
    const store = useProfileStore()

    const [tags, set_tags] = useState(profile_user.tags)
    const [approval_stats, set_approval_stats] = useState({} as any)
    const [completion_stats, set_completion_stats] = useState({} as any)

    let cls = 'w-64'
    const approval_days = approval_stats?.avg_accept_days?.toFixed(2) ?? '?'
    const approval_time = approval_stats?.accepted_count ? ((approval_stats.accepted_count / approval_stats.total_count) * 100).toFixed(2) : '?'

    const completion_days = completion_stats?.avg_complete_days?.toFixed(2) ?? '?'
    const completion_time = completion_stats?.complete_count ? ((completion_stats.complete_count / completion_stats.total_count) * 100).toFixed(2) : '?'
    
    useEffect(() => {

        if (profile_user) {
            store.get_approval_stats(profile_user._id).then(r => set_approval_stats(r ?? {}))
            store.get_completion_stats(profile_user._id).then(r => set_completion_stats(r ?? {}))
        }

    }, [profile_user])

    return (
        <Panel
            id="profile-info"
            className={props.className ? cls + ' ' + props.className : cls}
            bordered>
            <p>
                <ProfileNameTag />
            </p>
            <p>
                <TagGroup
                    edit={profile_owner}
                    filteredTagIds={tags.map(v => v._id)}
                    onChange={a => {
                        let t = tag_store.state.tags.filter(v => a.includes(v._id))
                        set_tags([...tags, ...t])
                        tag_store.add_user_tags(profile_user, t)
                    }}>
                    {tags.map(t => {
                        return (
                            <Tag
                                key={t._id}
                                closable={profile_owner}
                                onClose={ev => {
                                    ev.preventDefault()
                                    tag_store.remove_user_tag(profile_user, t._id)
                                    set_tags(
                                        tags.filter(ot => t._id !== ot._id)
                                    )
                                }}
                                color={t.color} className="subtle">
                                {t.name}
                            </Tag>
                        )
                    })}
                </TagGroup>
            </p>
            <hr />
            <p>
                <strong>{t`Commission details`}:</strong>
                <p>
                    <table className="w-full">
                        <tbody>
                            <tr className="border-t border-b">
                                <td>{t`Approval rate`}:</td>
                                <td>{approval_time}%</td>
                            </tr>
                            <tr className="border-t border-b">
                                <td>{t`Approval time`}:</td>
                                <td>{t`${approval_days} days`}</td>
                            </tr>
                            <tr className="border-t border-b">
                                <td>{t`Completion rate`}:</td>
                                <td>{completion_time}%</td>
                            </tr>
                            <tr className="border-t border-b">
                                <td>{t`Completion time`}:</td>
                                <td>{t`${completion_days} days`}</td>
                            </tr>
                        </tbody>
                    </table>
                </p>
            </p>
            <p>
                <strong>{t`Location`}:</strong>
                <p>
                    {profile_user.country
                        ? codeToCountryName(profile_user.country)
                        : t`Unknown`}
                </p>
            </p>
            <p>
                <strong>{t`Follow me on`}:</strong>
                <p>
                    <ul className="list-disc">
                        {profile_user.socials.map((v, idx) => {
                            let u = v.url
                            let is_link = false
                            const matches = v.url.match(
                                /^(?:https?:)?(?:\/\/)?(?:www\.)?([^/?]+)/i
                            )
                            if (matches && matches[1]) {
                                u = matches[1]
                                is_link = true
                            }
                            return (
                                <li key={v.name + idx.toString()}>
                                    {is_link && (
                                        <>
                                            {' '}
                                            <a href={v.url}>{v.name}</a>
                                            <span className="muted">
                                                @{u}
                                            </span>{' '}
                                        </>
                                    )}
                                    {!is_link && (
                                        <>
                                            {' '}
                                            {v.name}
                                            <span className="muted">
                                                @{u}
                                            </span>{' '}
                                        </>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </p>
            </p>
            <div className="text-center">
                <Button appearance="subtle" size="sm">{t`Report`}</Button>
            </div>
        </Panel>
    )
}

export default ProfileInfo
