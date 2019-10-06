import React, { useState, useEffect } from 'react';
import { TagGroup as RTagGroup, Tag as RTag, TagPicker, Icon } from 'rsuite';
import { TagProps as RTagProps } from 'rsuite/lib/Tag';
import { TagGroupProps as RTagGroupProps } from 'rsuite/lib/TagGroup';

import './Tag.scss'
import { useTagStore } from '@store/user';

interface TagProps extends RTagProps {

}

export const Tag = (props: TagProps) => {
    let cls = "tag"
    return (
        <RTag className={props.className ? cls + ' ' + props.className : cls} {...props}/>
    );
};


interface TagGroupProps extends RTagGroupProps {
    edit?: boolean
}

export const TagGroup = ({edit, children, ...props}: TagGroupProps) => {
    const [editing, set_editing] = useState(false)
    const store = useTagStore()
    useEffect(() => {
        if (editing && !store.state.tags.length) {
            (async () => {
                store.setState({tags: await store.load(null)})
            })()
        }
    }, [editing])

    let cls = "tags"
    return (
        <RTagGroup className={props.className ? cls + ' ' + props.className : cls} {...props}>
            {children}
            {edit && editing &&
            <Tag className="w-full">
                <form className="w-full" onSubmit={ev => {ev.preventDefault(); set_editing(false)}}>
                    <TagPicker className="w-full" data={store.state.tags} size="sm"/>
                </form>
            </Tag>
            }
            {edit && !editing && <Tag onClick={ev => {ev.preventDefault(); set_editing(true)}} componentClass="button"><Icon icon="plus"/></Tag>}
        </RTagGroup>
    )
}

export default Tag;