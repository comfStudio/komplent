import React, { useState } from 'react';
import { Modal, Button, Form } from 'rsuite';

import { useUser } from '@hooks/user';
import { t } from '@app/utility/lang'

import './UserTypeModal.scss'

export const UserType = () => {
    
}

interface Props {
    show?: boolean
}

const UserTypeModal = (props: Props) => {
    const [ user_type, set_user_type ] = useState(null)
    const user = useUser()
    let show = props.show
    if (user.type) {
        show = true
    }
    
    return (
        <Modal backdrop="static" show={show} size="xs">
            <Modal.Body>
                <h3>{t`What type of user are you?`}</h3>
                <form onSubmit={ev => { ev.preventDefault(); }}>
                    <div className="user-type-buttons">
                        <label title={t`Buyer`}>
                            <input type="radio" name="usertype" value="consumer" onChange={ev => set_user_type(ev.target.value)} /> 
                            <span>{t`Buyer`}</span>
                        </label>
                        <label title={t`Creator`}>
                            <input type="radio" name="usertype" value="creator" onChange={ev => set_user_type(ev.target.value)} /> 
                            <span>{t`Creator`}</span>
                        </label>
                    </div>
                    <p>
                    <Button disabled={!!!user_type} appearance="primary" type="submit" block>{t`Confirm`}</Button>
                    </p>
                </form>
                <p className="subtext mt-3">{t`Don't worry, we will only ask once. You can change this anytime in your settings.`}</p>
            </Modal.Body>
        </Modal>
    );
};

export default UserTypeModal;