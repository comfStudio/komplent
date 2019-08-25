import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";

import React from 'react';

const Placeholder = (props) => {
    return (
        <ReactPlaceholder {...props}/>
    );
};

export default Placeholder;