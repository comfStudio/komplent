import React, { useEffect, useState, useLayoutEffect } from 'react';
import useGlobalHook, { Store as HookStore } from '@znemz/use-global-hook';
import { useMount } from 'react-use'
import { createContainer } from "unstated-next"

import { storage } from '@app/client'
import { is_server } from '@utility/misc';

export const defineGlobalStore = (initialState: object, actions?: object, initializer?) => {
    actions = actions || {}
    if (actions['setState'] === undefined) {
        actions['setState'] = (prev_state: any, next_state: object) => {
            prev_state.setState(next_state)
        }
    }

    let store = null
    let r = useGlobalHook({ React, initialState, actions, initializer: (s) => {store = s; initializer ? initializer(s) : null } });
    function useHook() {
        const [state, actions] = r()
        return {state, ...actions} as any
    }
    useHook.store = store
    useHook.actions = store.actions
    useHook.initialized = false
    return useHook
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

interface StoreActions<S> {
    [x: string]: Function
    setState?(S)
}

export function createStore <S, A extends StoreActions<Partial<S>>> (base_state: S, actions?: A, on_init: Function = null) {
    let inited = false
    
    const useStoreHook = (initial_state?: Partial<S>) => {
        let [state, setState] = useState({...base_state, ...initial_state})
        return { state, setState }
    }

    const container = createContainer(useStoreHook)
    
    function StoreFn() {
        const store_state = container.useContainer()
        const setState = (next_state: Partial<S>) => store_state.setState({...store_state.state, ...next_state})
        let store_actions = {setState, ...actions as A }
        let store = {state:store_state.state, ...store_actions}
        for (let a in actions) {
            if (typeof store_actions[a] === 'function') {
                store_actions[a] = (store_actions[a] as Function).bind(store)
            }
        }
        if (!inited && on_init) {
            inited = true
            on_init.bind(store)()
        }
        return store
    }
    StoreFn.Provider = container.Provider
    StoreFn.createState = (state: Partial<S>) => state
    StoreFn.actions = actions
    return StoreFn
}