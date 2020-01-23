import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

import React, { memo } from 'react'

const Placeholder = memo(function Placeholder(props) {
    return <ReactPlaceholder {...props} />
})

export default Placeholder
