import React, { useEffect } from 'react';
import useGlobalHook, { Store as HookStore } from '@znemz/use-global-hook';
import { useMount } from 'react-use'

import { storage } from '@app/client'
import { is_server } from '@utility/misc';

export const defineStore = (initialState: object, actions?: object, initializer?) => {
    actions = actions || {}
    if (actions['setState'] === undefined) {
        actions['setState'] = (prev_state: any, next_state: object) => {
            prev_state.setState(next_state)
        }
    }

    let store = null
    let r = useGlobalHook({ React, initialState, actions, initializer: (s) => {store = s; initializer ? initializer(s) : null } });
    r['store'] = store
    r['actions'] = store.actions
    r['initialized'] = false
    return r
}

export const useInitializeStore = (s: object, state, once = true, only_undefined = true) => {
    const effect = () => {
        initializeStore(s, state, only_undefined)
    }
    if (once) {
        useMount(effect)
    } else {
        useEffect(effect, [state])
    }
}

export const initializeStore = (s: object, state, only_undefined = true) => {
    if (Object.keys(s).length > 1) {
        throw Error("Only one store is allowed, remember to call like this { Store } so the store name is preserved")
    }
    let store_name = Object.keys(s)[0]
    let Store = s[store_name]
    if (state && Store) {
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
        let d = {}
        d[store_name] = Store.store
        persistStoreDev(d, state)
    }
}

export const persistStoreDev = async (s: object, state?) => {
    if (process.env.NODE_ENV === 'development' && !is_server()) {
        for (const [key, value] of Object.entries(s)) {
            await storage.setItem(key, state === undefined ? value.state : state)
        }
    }
}

export const bootstrapStoreDev = async (s: object) => {
    if (process.env.NODE_ENV === 'development' && !is_server()) {
        for (const [key, value] of Object.entries(s)) {
            let d = await storage.getItem(key)
            if (d) {
                value.setState(d)
            }
        }
    }
}