import React, { useState } from 'react';
import { Modal, Button, Schema, Form, FormGroup, ControlLabel, FormControl, Input, InputGroup, Message, HelpBlock } from 'rsuite';
import { t } from '@app/utility/lang'
import useUserStore from '@store/user';

const { StringType, NumberType, BooleanType, ArrayType, ObjectType } = Schema.Types;


const new_convo_model = Schema.Model({
    reciepient: StringType().isRequired(t`This field is required.`),
    subject: StringType().isRequired(t`This field is required.`),
  });

interface NewConvoModalProps {
    show?: boolean
    onClose?: () => void
}

const NewConvoModal = (props: NewConvoModalProps) => {

    const [ loading, set_loading ] = useState(false)
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState()
    const [error, set_error] = useState(null)

    return (
        <Modal backdrop={true} show={props.show} size="sm" onHide={props.onClose}>
            <Modal.Body>
                <h3>{t`Start a new conversation`}</h3>
                <Form fluid formValue={form_value} model={new_convo_model} ref={ref => (set_form_ref(ref))} onChange={(value => set_form_value(value))}>
                    <FormGroup>
                        <ControlLabel>{t`Subject`}:</ControlLabel>
                        <FormControl fluid name="subject" accepter={Input} type="text" required />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{t`To`}:</ControlLabel>
                        <InputGroup>
                            <InputGroup.Addon>@</InputGroup.Addon>
                            <FormControl fluid name="reciepient" accepter={Input} type="text" required />
                        </InputGroup>
                        <HelpBlock>{t`Need to contact a staff member? Start a conversation with the user "staff"`}</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        {!!error && <Message type="error" description={error} />}
                    </FormGroup>
                    <p>
                    <Button loading={loading}appearance="primary" type="submit" block onClick={async ev => { ev.preventDefault();
                        if (form_ref && form_ref.check()) {
                            set_loading(true)
                            set_error(null)
                            
                            if (await useUserStore.actions.exists(form_value.reciepient)) {
                                
                                if (props.onClose) {
                                    props.onClose()
                                }
                            } else {
                                set_error(t`User does not exists`)
                            }

                            set_loading(false)

                        }
                        }}>
                        {t`Confirm`}
                    </Button>
                    </p>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default NewConvoModal;