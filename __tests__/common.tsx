import React from 'react'
import cookies from 'nookies'
import unfetch from 'isomorphic-unfetch'
import { when, resetAllWhenMocks } from 'jest-when'

import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

import { StoreProvider, server_initialize } from '@pages/_app'
import { COOKIE_AUTH_TOKEN_KEY } from '@server/constants'
import { RequestMethod, createMocks } from 'node-mocks-http'

export const S = Cmp => {
    return props => (
        <StoreProvider>
            <Cmp {...props} />
        </StoreProvider>
    )
}

export const getPageProps = async Page =>
    await Page.getInitialProps({
        pathname: '',
        query: {},
        asPath: 'mock',
        AppTree: null,
    })

export const setupCookies = (obj = {}) => {
    cookies.get.mockReturnValue(obj)
}

export const setupCommissions = () => {
    when(unfetch)
        .calledWith('/api/fetch')
        .mockResolvedValue({
            status: 200,
            json: async () => ({
                data: [
                    {
                        _id: '5d8befdaee91c156ecb6ec6a',
                        finished: true,
                        completed: false,
                        accepted: true,
                        attachments: [],
                        from_title: 'a furry comm',
                        from_user: {
                            _id: '5d88443f6e8eb33cc0991c4c',
                            type: 'creator',
                            tags: [],
                            rates: [],
                            followings: [],
                            followers: [],
                            recommendations: [],
                            commission_rates: [],
                            galleries: [],
                            username: 'twiddly',
                            email: 'fdfghfgh1f@fhgfgh.com',
                            socials: [],
                            created: '2019-09-23T04:04:15.394Z',
                            updated: '2019-09-23T04:04:27.464Z',
                            settings: {},
                            __v: 0,
                        },
                        to_user: {
                            _id: '5d8844354656433cc0991c4c',
                            type: 'creator',
                            tags: [],
                            rates: [],
                            followings: [],
                            followers: [],
                            recommendations: [],
                            commission_rates: [],
                            galleries: [],
                            username: 'twiddly',
                            email: 'fdfghfgh1f@fhgfgh.com',
                            socials: [],
                            created: '2019-09-23T04:04:15.394Z',
                            updated: '2019-09-23T04:04:27.464Z',
                            settings: {},
                            __v: 0,
                        },
                        created: '2019-09-25T22:53:14.812Z',
                        updated: '2019-09-27T18:17:18.218Z',
                        __v: 0,
                        end_date: '2019-09-27T18:17:18.073Z',
                    },
                    {
                        _id: '5d8beddree91c156ecb6ec6a',
                        finished: true,
                        completed: false,
                        accepted: true,
                        attachments: [],
                        from_title: 'a furry comm',
                        from_user: {
                            _id: '5d88443f6e8eb33cc0991c4c',
                            type: 'creator',
                            tags: [],
                            rates: [],
                            followings: [],
                            followers: [],
                            recommendations: [],
                            commission_rates: [],
                            galleries: [],
                            username: 'twiddly',
                            email: 'fdfghfgh1f@fhgfgh.com',
                            socials: [],
                            created: '2019-09-23T04:04:15.394Z',
                            updated: '2019-09-23T04:04:27.464Z',
                            settings: {},
                            __v: 0,
                        },
                        to_user: {
                            _id: '5d8844354656433cc0991c4c',
                            type: 'creator',
                            tags: [],
                            rates: [],
                            followings: [],
                            followers: [],
                            recommendations: [],
                            commission_rates: [],
                            galleries: [],
                            username: 'twiddly',
                            email: 'fdfghfgh1f@fhgfgh.com',
                            socials: [],
                            created: '2019-09-23T04:04:15.394Z',
                            updated: '2019-09-23T04:04:27.464Z',
                            settings: {},
                            __v: 0,
                        },
                        created: '2019-09-25T22:53:14.812Z',
                        updated: '2019-09-27T18:17:18.218Z',
                        __v: 0,
                        end_date: '2019-09-27T18:17:18.073Z',
                    },
                ],
            }),
        })
}

export const resetCommissions = () => {
    resetAllWhenMocks()
}

export const setupAuth = () => {
    let d = {}
    d[COOKIE_AUTH_TOKEN_KEY] = 'mock'
    setupCookies(d)
    when(unfetch)
        .calledWith('/api/user')
        .mockResolvedValue({
            status: 200,
            json: async () => ({
                user: {
                    _id: '5d88443f6e8eb33cc0991c4c',
                    type: 'creator',
                    tags: [],
                    rates: [],
                    followings: [],
                    followers: [],
                    recommendations: [],
                    commission_rates: [],
                    galleries: [],
                    username: 'twiddly',
                    email: 'fdfghfgh1f@fhgfgh.com',
                    socials: [],
                    created: '2019-09-23T04:04:15.394Z',
                    updated: '2019-09-23T04:04:27.464Z',
                    settings: {},
                    __v: 0,
                },
            }),
        })
}

export const resetAuth = () => {
    resetAllWhenMocks()
}

export function prepareJSONbody(method: RequestMethod, body: object, {headers = {}, extra = {}} = {}) {
    return {
        method,
        body,
        headers: {'content-type':'application/json', ...headers},
        ...extra
      }
}

export function setupServices() {

    jest.setTimeout(30000);

    const replSet = new MongoMemoryReplSet({
    replSet: { storageEngine: 'wiredTiger' },
    });
    return replSet.waitUntilRunning().then(async () => {
        mongoose.Promise = Promise;

        return await replSet.getUri().then(async (mongoUri) => {
        const mongooseOpts = {
            // options for mongoose 4.11.3 and above
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
        };
    
        mongoose.connection.on('error', (e) => {
            if (e.message.code === 'ETIMEDOUT') {
            console.log(e);
            mongoose.connect(mongoUri, mongooseOpts);
            }
            console.log(e);
        });
    
        mongoose.connection.once('open', () => {
            console.log(`MongoDB successfully connected to ${mongoUri}`);
        });
    
    
        await mongoose.connect(mongoUri, mongooseOpts)
    
        await server_initialize()
    
        });

    })

}

export function createHTTPMocks(...args) {
    let {req, res} = createMocks(...args)
    req.socket = {
        remoteAddress: "127.0.0.1"
    }
    return {req, res}
}