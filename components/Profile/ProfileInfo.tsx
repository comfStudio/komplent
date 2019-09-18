import React from 'react';
import { Tag, Button, Panel, TagGroup, Progress } from 'rsuite';

import { ProfileNameTag } from '@components/Profile'
import { useProfileUser, useUser } from '@hooks/user'
import { t } from '@app/utility/lang'

import { HTMLElementProps } from '@utility/props'

const { Circle } = Progress

import './ProfileInfo.scss'

interface Props extends HTMLElementProps {

}

export const ProfileInfo = (props: Props) => {
    const { profile_user } = useProfileUser()
    let cls = "w-64"
    return (
        <Panel id="profile-info" className={props.className ? cls + ' ' + props.className : cls} bordered>
            <p>
                <ProfileNameTag name={profile_user.name || profile_user.username}/>
            </p>
            <p>
                <TagGroup className="tags">
                    <Tag color="blue">Illustration</Tag>
                    <Tag color="green">Cover</Tag>
                    <Tag color="red">Anime</Tag>
                    <Tag color="orange">Animation</Tag>
                    <Tag color="violet">Comic</Tag>
                    <Tag color="yellow">Furry</Tag>
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
                <strong>{t`Origin`}:</strong>
                <p>
                    Denmark
                </p>
            </p>
            <p>
                <strong>{t`Socials`}:</strong>
                <p>
                    <ul className="list-disc">
                        <li><a href="#">aTwiddly</a></li>
                        <li><a href="#">@twiddlyart</a></li>
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