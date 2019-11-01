import React, { useState } from 'react';
import { Editor } from 'slate-react'
import { Value } from 'slate'
import PasteLinkify from 'slate-paste-linkify'
import InsertImages from 'slate-drop-or-paste-images'
import Lists from "@convertkit/slate-lists"
import MarkHotkeys from 'slate-mark-hotkeys';
import SoftBreak from 'slate-soft-break'

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

const plugins = [
  SoftBreak(),
  PasteLinkify(),
  MarkHotkeys(),
  InsertImages({
    extensions: ['png', 'jpg'],
    insertImage: (change, file) => {
      return change.insertBlock({
        type: 'image',
        isVoid: true,
        data: { file }
      })
    }
  }),
  Lists({
    blocks: {
      ordered_list: "ordered-list",
      unordered_list: "unordered-list",
      list_item: "list-item",
    },
    classNames: {
      ordered_list: "ordered-list",
      unordered_list: "unordered-list",
      list_item: "list-item"
    }
  })
]

interface TextEditorProps {
  placeholder?: string,
  readOnly?: boolean
}

const TextEditor = (props: TextEditorProps) => {

    const [value, set_value] = useState(initialValue)

    return (
        <div>
            <Editor value={value} onChange={({value}) => {set_value(value)}} plugins={plugins} readOnly={props.readOnly} placeholder={props.placeholder}/>
        </div>
    );
};

export default TextEditor;