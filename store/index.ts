import React from 'react';
import useGlobalHook from '@znemz/use-global-hook';

export const defineStore = (initialState: object, actions?) => {
    actions = actions || {}
    if (actions['updateState'] === undefined) {
        actions['updateState'] = (prev_state: any, next_state: object) => {
            prev_state.setState(next_state)
        }
    }
    return useGlobalHook({ React, initialState, actions });
}