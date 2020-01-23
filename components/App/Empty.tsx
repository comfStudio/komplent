import React, { memo } from 'react';
import { CenterPanel, CenterPanelProps } from './MainLayout';
import { HTMLElementProps } from '@utility/props';

interface EmptyProps {
    type?: 'accept_request'
    | 'accept_terms'
    | 'android'
    | 'around_the_world'
    | 'art'
    | 'artist'
    | 'begin_chat'
    | 'blank_canvas'
    | 'cancel'
    | 'completed'
    | 'confirmation'
    | 'connected_world'
    | 'contact_us'
    | 'deliveries'
    | 'Devices'
    | 'discount'
    | 'download'
    | 'elements'
    | 'fingerprint'
    | 'following'
    | 'hire'
    | 'interaction_design'
    | 'investing'
    | 'in_progress'
    | 'making_art'
    | 'notify'
    | 'organize_photos'
    | 'page_not_found'
    | 'payments'
    | 'personal_settings'
    | 'profile_data'
    | 'questions'
    | 'security'
    | 'server_down'
    | 'setup_wizard'
    | 'stripe_payments'
    | 'team_page'
    | 'update'
    | 'upgrade'
    | 'upload_image'
}

export const Empty = memo(function Empty({type = 'art', className = "m-auto", ...props}: EmptyProps & HTMLElementProps) {
    const el = require(`@assets/images/illust/${type}.svg`)
    return (<img src={el} className={className} {...props} />);
})

interface EmptyPanelProps extends EmptyProps, CenterPanelProps {

}

export const EmptyPanel = memo(function EmptyPanel(props: EmptyPanelProps) {

    return (
        <CenterPanel {...props}>
            <Empty {...props}/>
        </CenterPanel>
    );
})

export default Empty;