import React from 'react';
import { Cat, Ghost, Backpack, CreditCard, File, IceCream, Mug, Planet, SpeechBubble } from 'react-kawaii'
import { CenterPanel, CenterPanelProps } from './MainLayout';

interface EmptyProps {
    type?: 'Cat' | 'Ghost'| 'Backpack' | 'CreditCard' | 'File' | 'IceCream' | 'Mug' | 'Planet' | 'SpeechBubble'
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