import { Selector, t, RequestLogger  } from 'testcafe'
import { page_url, get_window_location, LoginPage, get_creator_user } from './setup'

class Page {

    creator_user: any
    update_logger: RequestLogger
    task_logger: RequestLogger

    constructor (creator_user = undefined) {
        this.creator_user = creator_user ?? get_creator_user()
        this.update_logger = RequestLogger({ url: '/api/update', method: 'post' }, {
            logResponseHeaders: true,
            logResponseBody: true,
            logRequestBody: true
        });

        this.task_logger = RequestLogger({ url: '/api/task', method: 'post' }, {
            logResponseHeaders: true,
            logResponseBody: true,
            logRequestBody: true
        });
    }

    async change_commission_status () {
    }

    async change_profile_visibility () {
    }

    async change_status_visibility () {
    }

    async change_mature_content () {
    }

    async change_picture () {
    }

    async change_socials () {
    }

    async change_about () {
    }
}


fixture("Profile").page(page_url("/login"))
    .beforeEach(async t => {
        const p = new LoginPage()
        const u = get_creator_user()
        await p.login(u.username, u.password)
        await t.navigateTo('/' + u.profile + '/edit')
    })

test('Can change commission status', async t => {
    const p = new Page()
    await p.change_commission_status()
})

test('Can change profile visibility', async t => {
    const p = new Page()
    await p.change_profile_visibility()
})

test('Can change status visibility', async t => {
    const p = new Page()
    await p.change_status_visibility()
})

test('Can change mature content', async t => {
    const p = new Page()
    await p.change_mature_content()
})

test('Can change profile picture', async t => {
    const p = new Page()
    await p.change_picture()
})

test('Can change profile socials', async t => {
    const p = new Page()
    await p.change_socials()
})

test('Can change profile about', async t => {
    const p = new Page()
    await p.change_about()
})
