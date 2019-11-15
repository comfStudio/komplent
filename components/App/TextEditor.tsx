import React, { Component } from 'react';
import classNames from 'classnames';

import { t } from '@app/utility/lang'

import { is_server } from '@utility/misc';

import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
const Quill = is_server() ? undefined : require("quill")
const ImageDrop  = is_server() ? undefined : require("quill-image-drop-module").ImageDrop

if (!is_server()) {
  Quill.register('modules/imageDrop', ImageDrop);
}

interface TextEditorProps {
  id?: string
  value?: string
  delta?: any
  defaultDelta?: any
  style?: object
  className?: string
  placeholder?: string
  readOnly?: boolean
  modules?: object
  formats?: string[]
  theme?: string
  headerTemplate?: any
  onTextChange?: (value: {
    htmlValue: string,
    textValue: string,
    delta: any,
    source: 'api' | 'user' | 'silent'
    }) => void
  onSelectionChange?: (value: {
    range: number,
    oldRange: number,
    source: 'api' | 'user' | 'silent'
    }) => void
}

export class TextEditor extends Component<TextEditorProps> {

    static defaultProps = {
      id: null,
      value: null,
      style: null,
      className: null,
      placeholder: null,
      readOnly: false,
      modules: null,
      formats: null,
      theme: 'snow',
      headerTemplate: null,
      onTextChange: null,
      onSelectionChange: null
    };

    editorElement: any
    toolbarElement: any
    quill: any

    componentDidMount() {
      if (is_server()) return
        this.quill = new Quill(this.editorElement, {
            modules: {
                toolbar: this.toolbarElement,
                imageDrop: true,
                ...this.props.modules
            },
            placeholder: this.props.placeholder,
            readOnly: this.props.readOnly,
            theme: this.props.theme,
            formats: this.props.formats
        });

        if (this.props.value) {
            this.quill.pasteHTML(this.props.value);
        }

        if (this.props.defaultDelta) {
          this.quill.setContents(this.props.defaultDelta);
        }

        if (this.props.delta) {
          this.quill.setContents(this.props.delta);
        }

        this.quill.on('text-change', (delta, source) => {
            let html = this.editorElement.children[0].innerHTML;
            let text = this.quill.getText();
            if (html === '<p><br></p>') {
                html = null;
            }

            if (this.props.onTextChange) {
                this.props.onTextChange({
                    htmlValue: html,
                    textValue: text,
                    delta: this.quill.getContents(),
                    source: source
                });
            }
        });

        this.quill.on('selection-change', (range, oldRange, source) => {
            if(this.props.onSelectionChange) {
                this.props.onSelectionChange({
                    range: range,
                    oldRange: oldRange,
                    source: source
                });
            }
        });
    }

    componentDidUpdate(prevProps) {
      if (is_server()) return
        if (this.props.value !== prevProps.value && this.quill && !this.quill.hasFocus()) {
            if(this.props.value)
                this.quill.pasteHTML(this.props.value);
            else
                this.quill.setText('');
        }
        if (this.props.delta !== prevProps.delta && this.quill && !this.quill.hasFocus()) {
          if(this.props.delta)
              this.quill.setContents(this.props.delta);
        }
    }

    render() {
      if (is_server()) return null
        let containerClass = classNames('p-component p-editor-container', this.props.className);
        let toolbarHeader = null;

        if (this.props.headerTemplate) {
            toolbarHeader = (
                <div ref={(el) => this.toolbarElement = el} className="p-editor-toolbar">
                    {this.props.headerTemplate}
                </div>
            );
        }
        else {
            toolbarHeader = (
                <div ref={el => this.toolbarElement = el} className="p-editor-toolbar">
                    <span className="ql-formats">
                        <select className="ql-header" defaultValue="0">
                          <option value="1">{t`Heading`}</option>
                          <option value="2">{t`Subheading`}</option>
                          <option value="0">{t`Normal`}</option>
                        </select>
                        <select className="ql-font">
                            <option ></option>
                            <option value="serif"></option>
                            <option value="monospace"></option>
                        </select>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-bold" aria-label="Bold"></button>
                        <button className="ql-italic" aria-label="Italic"></button>
                        <button className="ql-underline" aria-label="Underline"></button>
                    </span>
                    <span className="ql-formats">
                        <select className="ql-color"></select>
                        <select className="ql-background"></select>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
                        <button className="ql-list" value="bullet" aria-label="Unordered List"></button>
                        <select className="ql-align">
                            <option defaultValue></option>
                            <option value="center"></option>
                            <option value="right"></option>
                            <option value="justify"></option>
                        </select>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-link" aria-label="Insert Link"></button>
                        <button className="ql-image" aria-label="Insert Image"></button>
                        <button className="ql-code-block" aria-label="Insert Code Block"></button>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-clean" aria-label="Remove Styles"></button>
                    </span>
                </div>
            );
        }

        let content = (<div ref={(el) => this.editorElement = el} className="p-editor-content" style={this.props.style}></div>)

        return (
            <div id={this.props.id} className={containerClass}>
                {toolbarHeader}
                {content}
            </div>
        );
    }
}

export default TextEditor