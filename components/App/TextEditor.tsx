import React, { useState } from 'react';
import { Editor } from 'slate-react'
import { Value } from 'slate'

const initialValue = Value.fromJSON({
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              text: 'A line of text in a paragraph.',
            },
          ],
        },
      ],
    },
  })

const TextEditor = (props) => {

    const [value, set_value] = useState(initialValue)

    return (
        <div>
            <Editor value={value} onChange={({v}) => {set_value(v)}} {...props} />
        </div>
    );
};

export default TextEditor;