import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'rsuite';

import { useUser } from '@app/client/hooks/user';
import { useUpdateDatabase, useUpdateDocument } from '@app/client/hooks/db';
import { user_schema } from '@schema/user'
import { t } from '@app/utility/lang'
import { useUserStore } from '@client/store/user'

import './UserTypeModal.scss'

export const UserType = () => {
    
}

interface Props {
}

const UserTypeModal = (props: Props) => {
    const current_user = useUser()
    if (current_user) {

        const store = useUserStore()
        
        const [ show, set_show ] = useState(false)
        const [ loading, set_loading ] = useState(false)
        const [ user, set_user ] = useUpdateDocument({type: current_user.type})
        const update = useUpdateDatabase(current_user, user_schema)

        console.log(store.state.has_selected_usertype)

        useEffect(() => {
            console.log("effect")
            console.log(store.state.has_selected_usertype)
            console.log(store.state.has_selected_usertype === false)
            set_show(store.state.has_selected_usertype === false)
        }, [store.state.has_selected_usertype])

        return (
            <Modal backdrop="static" show={show} size="xs">
                <Modal.Body>
                    <h3>{t`What type of user are you?`}</h3>
                    <form onSubmit={ async ev => { ev.preventDefault(); set_loading(true); store.setState({has_selected_usertype: true}); store.save({has_selected_usertype: true}); await update('User', user); set_loading(false) }}>
                        <div className="user-type-buttons">
                            <label title={t`Buyer`}>
                                <input type="radio" name="usertype" value="consumer" onChange={ev => { user.type = ev.target.value; set_user(user) }} /> 
                                <span>{t`Buyer`}</span>
                            </label>
                            <label title={t`Creator`}>
                                <input type="radio" name="usertype" value="creator" onChange={ev => { user.type = ev.target.value; set_user(user) }} /> 
                                <span>{t`Creator`}</span>
                            </label>
                        </div>
                        <p>
                        <Button loading={loading} disabled={!!!user.type} appearance="primary" type="submit" block>{t`Confirm`}</Button>
                        </p>
                    </form>
                    <p className="subtext mt-3">{t`Don't worry, we will only ask once. You can change this anytime in your settings.`}</p>
                </Modal.Body>
            </Modal>
        );
    }

    return null
};

export default UserTypeModal;