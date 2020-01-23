import React, { useState, useEffect, memo } from 'react'
import {
    TagGroup as RTagGroup,
    Tag as RTag,
    TagPicker,
    Icon,
    Button,
    IconButton,
} from 'rsuite'
import { TagProps as RTagProps } from 'rsuite/lib/Tag'
import { TagGroupProps as RTagGroupProps } from 'rsuite/lib/TagGroup'

import { t } from '@app/utility/lang'
import { useTagStore } from '@store/user'
import './Tag.scss'

interface TagProps extends RTagProps {}

export const Tag = memo(function Tag(props: TagProps) {
    let cls = 'tag'
    return (
        <RTag
            className={props.className ? cls + ' ' + props.className : cls}
            {...props}
        />
    )
})

interface TagGroupProps extends RTagGroupProps {
    edit?: boolean
    filteredTagIds?: Array<any>
    onChange?: Function
}

export const TagGroup = memo(function TagGroup({
    edit,
    children,
    filteredTagIds = [],
    onChange,
    ...props
}: TagGroupProps) {
    const [editing, set_editing] = useState(false)
    const [value, set_value] = useState([])
    const store = useTagStore()
    useEffect(() => {
        if (editing && !store.state.tags.length) {
            ;(async () => {
                store.setState({ tags: await store.load(null) })
            })()
        }
    }, [editing])

    let cls = 'tags'
    return (
        <RTagGroup
            className={props.className ? cls + ' ' + props.className : cls}
            {...props}>
            {children}
            {edit && editing && (
                <Tag className="w-full p-0">
                    <form
                        className="w-full"
                        onSubmit={ev => {
                            ev.preventDefault()
                            set_editing(false)
                            if (onChange) onChange(value)
                        }}>
                        <span>
                            <IconButton
                                icon={<Icon icon="close" />}
                                onClick={ev => {
                                    ev.preventDefault()
                                    set_editing(false)
                                }}
                                className="float-right"
                                type="buttun"
                                size="sm"
                            />
                            <IconButton
                                icon={<Icon icon="check" />}
                                className="float-right"
                                type="submit"
                                size="sm"
                            />
                            <TagPicker
                                onChange={v => set_value(v)}
                                className="w-full"
                                data={store.state.tags
                                    .filter(
                                        v => !filteredTagIds.includes(v._id)
                                    )
                                    .map(v => ({
                                        label: v.name,
                                        value: v._id,
                                    }))}
                                size="sm"
                            />
                        </span>
                    </form>
                </Tag>
            )}
            {edit && !editing && (
                <Tag
                    onClick={ev => {
                        ev.preventDefault()
                        set_editing(true)
                    }}
                    componentClass="button">
                    <Icon icon="plus" />
                </Tag>
            )}
        </RTagGroup>
    )
})

export default Tag
