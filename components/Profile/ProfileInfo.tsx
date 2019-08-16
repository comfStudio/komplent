import React, { Component } from 'react';
import { Card, Tag, Descriptions } from 'antd';

import { t } from '@app/utility/lang'
import './ProfileInfo.css'

export class ProfileInfo extends Component {
    render() {
        return (
            <Card id="profile-info" className="w-64 float-right">
                <p>
                    <Tag color="blue">Illustration</Tag>
                    <Tag color="green">Cover</Tag>
                    <Tag color="res">Anime</Tag>
                    <Tag color="magenta">Animation</Tag>
                    <Tag color="purple">Comic</Tag>
                    <Tag>Furry</Tag>
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
            </Card>
        );
    }
}

export default ProfileInfo;