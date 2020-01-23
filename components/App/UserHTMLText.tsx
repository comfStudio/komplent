import React, { memo } from 'react';

import './UserHTMLText.scss'


const UserHTMLText = memo(function UserHTMLText({html, as = 'div'}: {html: string, as?: any}) {
    const El = as
    return (
        <El className="user-html-text" dangerouslySetInnerHTML={{ __html: html }}/>
    );
})

export default UserHTMLText;