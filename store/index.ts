import React, { useEffect } from 'react';
import useGlobalHook, { Store as HookStore } from '@znemz/use-global-hook';
import { useMount } from 'react-use'

export const defineStore = (initialState: object, actions?: object, initializer?) => {
    actions = actions || {}
    if (actions['setState'] === undefined) {
        actions['setState'] = (prev_state: any, next_state: object) => {
            prev_state.setState(next_state)
        }
    }

    let store = null
    let r = useGlobalHook({ React, initialState, actions, initializer: (s) => {store = s; initializer(s) } });
    r['store'] = store
    r['initialized'] = false
    return r
}

export const useInitializeStore = (Store, state, once = true, only_undefined = true) => {
    const effect = () => {
        initializeStore(Store, state, only_undefined)
    }
    if (once) {
        useMount(effect)
    } else {
        useEffect(effect, [state])
    }
}

export const initializeStore = (Store, state, only_undefined = true) => {
    if (state) {
        let s = {...state}
        if (only_undefined) {
            for ( let k of Object.keys(s)) {
                if (Store.store.state[k] !== undefined) {
                    delete s[k]
                }
            }
        }
        Store.store.setState(s)
        Store.initialized = true
    }
}