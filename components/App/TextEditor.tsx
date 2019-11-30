import React, { Component } from 'react'
import classNames from 'classnames'
import { base64StringToBlob } from 'blob-util'
import { t } from '@app/utility/lang'

import { is_server } from '@utility/misc'
import * as pages from '@utility/pages'
import { fetch } from '@utility/request'

import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { OK } from 'http-status-codes'
const Quill = is_server() ? undefined : require('quill')
const imageDropAndPaste = is_server()
    ? undefined
    : require('quill-image-drop-and-paste').default

if (!is_server()) {
    Quill.register('modules/imageDropAndPaste', imageDropAndPaste)
}

function upload_image(formdata, range, quill) {
    const editor = quill.editor
    quill.enable(false);

    return fetch(pages.cdn_upload, {
        method: 'post',
        file: true,
        body: formdata
    }).then(async (response) => {
        quill.enable(true);
        if (response.status === OK) {
            editor.insertEmbed(range.index, 'image', (await response.json()).data.url);
            quill.setSelection(range.index + 1, Quill.sources.SILENT);
        }
    })
    .catch(error => {
        quill.enable(true);
    });
}

function toolbar_img_handler() {
    let fileInput = this.container.querySelector('input.ql-image[type=file]');

    if (fileInput == null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        fileInput.classList.add('ql-image');
        fileInput.addEventListener('change', () => {
            const files = fileInput.files;
            const range = this.quill.getSelection(true);

            if (!files || !files.length) {
                return;
            }

            const formData = new FormData();
            formData.append('file', files[0]);

            upload_image(formData, range, this.quill).then(() => {
                fileInput.value = '';
            })
        });
        this.container.appendChild(fileInput);
    }
    fileInput.click();
}

function image_drop_handler(data_url, type) {
    if (!type) type = 'image/png'

    const range = this.quill.getSelection(true);
   
    // base64 to blob
    var blob = base64StringToBlob(data_url.replace(/^data:image\/\w+;base64,/, ''), type)
   
    var filename = ['img_', Math.floor(Math.random() * 1e12), '_', new Date().getTime(), '.', type.match(/^image\/(\w+)$/i)[1]].join('')
   
    // generate a form data
    var formData = new FormData()
    formData.append('filename', filename)
    formData.append('file', blob)

    upload_image(formData, range, this.quill)
  }

interface TextEditorProps {
    id?: string
    value?: string
    delta?: any
    defaultDelta?: any
    style?: object
    className?: string
    placeholder?: string
    maxLength?: number
    readOnly?: boolean
    modules?: object
    formats?: string[]
    theme?: string
    headerTemplate?: any
    onTextChange?: (value: {
        htmlValue: string
        textValue: string
        delta: any
        length: number
        source: 'api' | 'user' | 'silent'
    }) => void
    onSelectionChange?: (value: {
        range: number
        oldRange: number
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
        onSelectionChange: null,
    }

    editorElement: any
    toolbarElement: any
    quill: any

    constructor(props) {
        super(props);
        this.state = { chars_count: props.maxLength };
      }

    componentDidMount() {
        if (is_server()) return

        this.quill = new Quill(this.editorElement, {
            modules: {
                toolbar: {
                    container: this.toolbarElement,
                    handlers: { image: toolbar_img_handler },
                },
                imageDropAndPaste: {
                    handler: image_drop_handler.bind(this)
                },
                ...this.props.modules,
            },
            placeholder: this.props.placeholder,
            readOnly: this.props.readOnly,
            theme: this.props.theme,
            formats: this.props.formats,
        })

        if (this.props.value) {
            this.quill.pasteHTML(this.props.value)
        }

        if (this.props.defaultDelta) {
            this.quill.setContents(this.props.defaultDelta)
        }

        if (this.props.delta) {
            this.quill.setContents(this.props.delta)
        }

        if ((this.props.delta || this.props.defaultDelta || this.props.value) && this.props.maxLength) {
            this.setState({chars_count: this.props.maxLength - this.quill.getLength() })
        }

        this.quill.on('text-change', (delta, source) => {
            if (this.props.maxLength && this.quill.getLength() > this.props.maxLength) {
                this.quill.deleteText(this.props.maxLength, this.quill.getLength());
                return
            }

            let html = this.editorElement.children[0].innerHTML
            let text = this.quill.getText()
            if (html === '<p><br></p>') {
                html = null
            }

            if (this.props.onTextChange) {
                this.props.onTextChange({
                    htmlValue: html,
                    textValue: text,
                    delta: this.quill.getContents(),
                    length: this.quill.getLength(),
                    source: source,
                })
            }

            if (this.props.maxLength) {
                this.setState({chars_count: this.props.maxLength - this.quill.getLength() })
            }
        })

        this.quill.on('selection-change', (range, oldRange, source) => {
            if (this.props.onSelectionChange) {
                this.props.onSelectionChange({
                    range: range,
                    oldRange: oldRange,
                    source: source,
                })
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (is_server()) return
        if (
            this.props.value !== prevProps.value &&
            this.quill &&
            !this.quill.hasFocus()
        ) {
            if (this.props.value) this.quill.pasteHTML(this.props.value)
            else this.quill.setText('')
        }
        if (
            this.props.delta !== prevProps.delta &&
            this.quill &&
            !this.quill.hasFocus()
        ) {
            if (this.props.delta) this.quill.setContents(this.props.delta)
        }
    }

    render() {
        if (is_server()) return null
        let containerClass = classNames(
            'p-component p-editor-container',
            this.props.className
        )
        let toolbarHeader = null

        if (this.props.headerTemplate) {
            toolbarHeader = (
                <div
                    ref={el => (this.toolbarElement = el)}
                    className="p-editor-toolbar">
                    {this.props.headerTemplate}
                </div>
            )
        } else {
            toolbarHeader = (
                <div
                    ref={el => (this.toolbarElement = el)}
                    className="p-editor-toolbar">
                    <span className="ql-formats">
                        <select className="ql-header" defaultValue="0">
                            <option value="1">{t`Heading`}</option>
                            <option value="2">{t`Subheading`}</option>
                            <option value="0">{t`Normal`}</option>
                        </select>
                        <select className="ql-font">
                            <option></option>
                            <option value="serif"></option>
                            <option value="monospace"></option>
                        </select>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-bold" aria-label="Bold"></button>
                        <button
                            className="ql-italic"
                            aria-label="Italic"></button>
                        <button
                            className="ql-underline"
                            aria-label="Underline"></button>
                    </span>
                    <span className="ql-formats">
                        <select className="ql-color"></select>
                        <select className="ql-background"></select>
                    </span>
                    <span className="ql-formats">
                        <button
                            className="ql-list"
                            value="ordered"
                            aria-label="Ordered List"></button>
                        <button
                            className="ql-list"
                            value="bullet"
                            aria-label="Unordered List"></button>
                        <select className="ql-align">
                            <option defaultValue></option>
                            <option value="center"></option>
                            <option value="right"></option>
                            <option value="justify"></option>
                        </select>
                    </span>
                    <span className="ql-formats">
                        <button
                            className="ql-link"
                            aria-label="Insert Link"></button>
                        <button
                            className="ql-image"
                            aria-label="Insert Image"></button>
                        <button
                            className="ql-code-block"
                            aria-label="Insert Code Block"></button>
                    </span>
                    <span className="ql-formats">
                        <button
                            className="ql-clean"
                            aria-label="Remove Styles"></button>
                    </span>
                    {(this.state.chars_count !== undefined) && this.state.chars_count < 250 &&
                    <span className="float-right muted">
                        {t`${this.state.chars_count} characters left`}
                    </span>
                    }
                </div>
            )
        }

        let content = (
            <div
                ref={el => (this.editorElement = el)}
                className="p-editor-content"
                style={this.props.style}></div>
        )

        return (
            <div id={this.props.id} className={containerClass}>
                {toolbarHeader}
                {content}
            </div>
        )
    }
}

export default TextEditor
