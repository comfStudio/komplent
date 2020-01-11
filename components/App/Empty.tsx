import React from 'react';
import { Cat, Ghost, Backpack, CreditCard, File, IceCream, Mug, Planet, SpeechBubble } from 'react-kawaii'
import { CenterPanel, CenterPanelProps } from './MainLayout';

interface EmptyProps {
    type?: 'undraw_accept_request'
    | 'undraw_accept_terms'
    | 'undraw_android'
    | 'undraw_around_the_world'
    | 'undraw_art'
    | 'undraw_artist'
    | 'undraw_begin_chat'
    | 'undraw_blank_canvas'
    | 'undraw_cancel'
    | 'undraw_completed'
    | 'undraw_confirmation'
    | 'undraw_connected_world'
    | 'undraw_contact_us'
    | 'undraw_deliveries'
    | 'undraw_Devices'
    | 'undraw_discount'
    | 'undraw_download'
    | 'undraw_elements'
    | 'undraw_fingerprint'
    | 'undraw_following'
    | 'undraw_hire'
    | 'undraw_interaction_design'
    | 'undraw_investing'
    | 'undraw_in_progress'
    | 'undraw_making_art'
    | 'undraw_notify'
    | 'undraw_organize_photos'
    | 'undraw_page_not_found'
    | 'undraw_payments'
    | 'undraw_personal_settings'
    | 'undraw_profile_data'
    | 'undraw_questions'
    | 'undraw_security'
    | 'undraw_server_down'
    | 'undraw_setup_wizard'
    | 'undraw_stripe_payments'
    | 'undraw_team_page'
    | 'undraw_update'
    | 'undraw_upgrade'
    | 'undraw_upload_image'
    mood: 'sad' | 'shocked' | 'happy' | 'blissful' | 'lovestruck' | 'excited' | 'ko'
    color?: string
}

export const Empty = ({type = 'Cat', color = "rgba(0, 0, 0, 0.5)", ...props}: EmptyProps) => {
    const El = {
        Cat,
        Ghost,
        Backpack,
        CreditCard,
        File,
        IceCream,
        Mug,
        Planet,
        SpeechBubble,
    }[type]



    return (<El mood={props.mood} className="emoji" color={color} />);
};

interface EmptyPanelProps extends EmptyProps, CenterPanelProps {

}

export const EmptyPanel = (props: EmptyPanelProps) => {

    return (
        <CenterPanel {...props}>
            <Empty {...props}/>
        </CenterPanel>
    );
};

export default Empty;