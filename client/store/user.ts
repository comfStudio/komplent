import qs from 'qs'
import cookies from 'nookies'
import { OK } from 'http-status-codes';

import Router from 'next/router'
import { createStore, bootstrapStoreDev } from '@client/store'
import * as pages from '@utility/pages'
import { fetch } from '@utility/request'
import { is_server } from '@utility/misc'
import { COOKIE_AUTH_TOKEN_KEY } from '@server/constants'
import { get_jwt_data, get_jwt_user } from '@server/middleware'
import { update_db } from '@app/client/db'
import user_schema, { user_store_schema } from '@schema/user'
import { Follow, Tag, Notification } from '@db/models';

export const fetch_user =  async (cookies_obj) => {
    if (cookies_obj[COOKIE_AUTH_TOKEN_KEY]) {
        if (is_server()) {
            return await get_jwt_user(get_jwt_data(cookies_obj[COOKIE_AUTH_TOKEN_KEY]))
        } else {
            let r = await fetch('/api/user')
            if (r.status == OK) {
                return (await r.json()).user
            }
        }

    }
}


export const useUserStore = createStore(
  {
      _id: undefined as string,
      current_user: undefined as any,
      logged_in: undefined as boolean,
      has_selected_usertype: true,
      active_commissions_count: 0,
      active_requests_count: 0,
  },
  {
    async login(data, redirect: boolean | string = false) {
    let r = await fetch("/api/login", {
        method: "post",
        json: true,
        body: data,
    })

        if (r.status == OK) {
        let data = await r.json()
        this.setState({current_user: data.user, logged_in: true})

        if (!is_server()) {
            cookies.set({},COOKIE_AUTH_TOKEN_KEY, data.token, {
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day
            })
        }

        if (redirect) {
            Router.replace(typeof redirect === 'string'? redirect : pages.dashboard)
        }
        return [true, null]
    }

    return [false, (await r.json()).error]
    },
    async logout(redirect = true) {
    let r = await fetch("/api/logout", {
        method: "get",
    })

        if (r.status == OK) {

        if (!is_server()) {
            cookies.destroy({}, COOKIE_AUTH_TOKEN_KEY)
        }

        this.setState({current_user: null, logged_in: false})

        if (redirect) {
            Router.replace(pages.home)
        }
        return [true, null]
    }

    return [false, (await r.json()).error]
    },
    async exists(name) {
    const r = await fetch(`/api/user?${qs.stringify({username:name, email:name})}`, {
        method: "get",
    })
    if (r.status == OK) {
        return true
    }
    return false
    },
    async join(data, redirect = false) {
    let r = await fetch("/api/join", {
        method: "post",
        json: true,
        body: data,
    })

    if (r.status == OK) {
        await this.login({name:data.email, password:data.password}, redirect)

        return [true, null]
    }

    return [false, (await r.json()).error]
    },
    async get_follow(profile_user, current_user?) {
        let f = null
        if (!current_user) {
            current_user = this.state.current_user
        }

        if (current_user && profile_user) {
            let q = {follower: current_user._id, followee: profile_user._id, end: null}
            if (is_server()) {
                f = await Follow.findOne(q).sort({"created": -1}).lean()
            } else {
                await fetch("/api/fetch",{
                    method:"post",
                    body: {model: "Follow",
                    method:"findOne",
                    query: q,
                    sort: {"created": -1}
                 }
                }).then(async (r) => {
                    if (r.ok) {
                        f = (await r.json()).data
                    }
                })
            }
        }

        return f
    },
    async update_user(data: object) {
        let r = await update_db({model: 'User', data: {_id: this.state.current_user._id, ...data}, schema: user_schema, validate: true})
        if (r.status) {
            this.setState({current_user: {...this.state.current_user, ...data}})
        }
        return r
    },
    async save(state?: object) {
        let s = {_id: this.state._id, has_selected_usertype: this.state.has_selected_usertype, user: this.state.current_user._id, ...state}
        return await update_db({model:'UserStore', data:s, schema:user_store_schema, validate:true, create:true})
    }
  },
);

export const useProfileStore = createStore(
    {
        _current_user: undefined as any,
        profile: undefined as any
    },
  );

export const useFollowerStore = createStore(
    {
        followers: []
    },
    {
        async get_followers(current_user) {
            let f = []
    
            if (current_user ) {
                let q = {follower: current_user._id, end: null}
                let p = "followee"
                let l = 100
                if (is_server()) {
                    f = await Follow.find(q).populate(p).sort({"created": -1}).limit(l).lean()
                } else {
                    await fetch("/api/fetch",{
                        method:"post",
                        body: {model: "Follow",
                        method:"find",
                        query: q,
                        sort: {"created": -1},
                        limit: l,
                        populate:p }
                    }).then(async (r) => {
                        if (r.ok) {
                            f = (await r.json()).data
                        }
                    })
                }
                f = f.map(v => v.followee)
            }
    
            return f
        },
    }
);

export const useNotificationStore = createStore(
    {
        notifications: []
    },
    {
        async get_notifications(current_user) {
            let f = []
    
            if (current_user ) {
                let q = {to_user: current_user._id}
                let p = "from_user"
                let l = 30
                if (is_server()) {
                    f = await Notification.find(q).populate(p).sort({"created": -1}).limit(l).lean()
                } else {
                    await fetch("/api/fetch",{
                        method:"post",
                        body: {model: "Notification",
                        method:"find",
                        query: q,
                        limit: l,
                        sort: {"created": -1},
                        populate:p }
                    }).then(async (r) => {
                        if (r.ok) {
                            f = (await r.json()).data
                        }
                    })
                }
            }

            return f
        },

        async get_notifications_count(current_user) {
            let f = 0
    
            if (current_user ) {
                let q = {to_user: current_user._id, read: null}
                if (is_server()) {
                    f = await Notification.find(q).countDocuments()
                } else {
                    await fetch("/api/fetch",{
                        method:"post",
                        body: {model: "Notification",
                        method:"find",
                        query: q,
                        count: true,
                     }
                    }).then(async (r) => {
                        if (r.ok) {
                            f = (await r.json()).data
                        }
                    })
                }
            }

            return f
        },
    }
);

export const useTagStore = createStore(
    {
        tags: []
    },
    {
        async remove_user_tag(user, tag_id: string) {
            if (user) {
                let tags = user.tags || []
                let l = tags.length
                tags = tags.filter(v => v._id != tag_id)
                if (tags.length === l) {
                    return true
                }
                return await update_db({
                    model: "User",
                    data: {_id: user._id, tags: tags},
                    schema: user_schema,
                    validate: true
                }).then(r => r.status)
            }
        },
        async add_user_tags(user, tags: Array<any>) {
            if (user && tags.length) {
                let u_tags = user.tags || []
                let ids = u_tags.map(v => v._id)
                tags.forEach(v => {if (!ids.includes(v._id)) u_tags.push(v)})
                if (u_tags.length) {
                    return await update_db({
                        model: "User",
                        data: {_id: user._id, tags: u_tags},
                        schema: user_schema,
                        validate: true
                    }).then(r => r.status)
                }
            }
        },
        async load(user) {
            let r = []
            if (is_server()) {
                r = await Tag.find()
            } else {
                r = await fetch("/api/fetch",{
                    method:"post",
                    body: {
                        model: "Tag",
                        method:"find"
                    }
                }).then(async (r) => {
                    if (r.ok) {
                        return (await r.json()).data
                    }
                    return []
                })
            }
            return r
        },
        async _create_defaults() {
            const default_tags = [
                {name:"Illustration", color:"blue"},
                {name:"Furry", color: "yellow"},
                {name:"Cover", color: "green"},
                {name:"NSFW", color: "red"},
                {name:"Anime", color: ""},
                {name:"Comic", color: "violet"},
                {name:"Concept", color: ""},
                {name:"Animation", color: "orange"},
            ]

            if (is_server()) {
                for (let t of default_tags) {
                    await Tag.findOne({name: t.name}).then(v => {
                        if (!v) {
                            let d = new Tag(t)
                            d.save()
                        }
                    })
                }
            }
        }
    }
    )


export default useUserStore;
