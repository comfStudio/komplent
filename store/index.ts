import React, { useEffect } from 'react';
import useGlobalHook, { Store as HookStore } from '@znemz/use-global-hook';
import { useMount } from 'react-use'

export const defineStore = (initialState: object, actions?: object, initializer?) => {
    actions = actions || {}
    if (actions['updateState'] === undefined) {
        actions['updateState'] = (prev_state: any, next_state: object) => {
            prev_state.setState(next_state)
        }
    }

    let store = null
    let r = useGlobalHook({ React, initialState, actions, initializer: (s) => {store = s; initializer(s) } });
    r['store'] = store
    r['initialized'] = false
    return r
}

export const useInitializeStore = (Store, state, once = true) => {
    const effect = () => {
        initializeStore(Store, state)
    }
    if (once) {
        useMount(effect)
    } else {
        useEffect(effect, [state])
    }
}

export const initializeStore = (Store, state) => {
    if (state) {
        Store.store.setState(state)
        Store.initialized = true
    }
}