import React, { Component } from 'react';
import { Tag, Button, Panel, TagGroup, Progress } from 'rsuite';

import { t } from '@app/utility/lang'

import { HTMLElementProps } from '@utility/props'

const { Circle } = Progress

import './ProfileInfo.scss'

export class ProfileInfo extends Component<HTMLElementProps> {
    render() {
        let cls = "w-64"
        return (
            <Panel id="profile-info" className={this.props.className ? cls + ' ' + this.props.className : cls} bordered>
                <p>
                    <h3 className="profile-name text-center">~A little twiddly~</h3>
                </p>
                <hr/>
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
                <p className="text-center">
                    <Circle percent={60} status="active" className="w-12 inline-block" />
                    <Circle percent={60} status="active" className="w-12 inline-block" />
                    <Circle percent={60} status="active" className="w-12 inline-block" />
                    <Circle percent={60} status="active" className="w-12 inline-block" />
                </p>
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
}

export default ProfileInfo;