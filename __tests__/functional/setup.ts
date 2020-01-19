require('dotenv').config()

import { ClientFunction, Selector, t } from 'testcafe';

export const get_window_location = ClientFunction(() => window.location);

export function page_url(path: string) {
    return process.env.URL + path
}

export function get_creator_user() {
    return {
        username: "twiddly",
        profile: "@twiddly",
        password: "fodbold123"
    }
}

export class LoginPage {

    user: string
    pass: string
    login_inp: any
    pass_inp: any
    button_inp: any

    constructor (user = undefined, pass = undefined) {
        this.user = user ?? 'twiddly'
        this.pass = pass ?? 'fodbold123'
        this.login_inp    = Selector('input[name="name"]');
        this.pass_inp = Selector('input[name="password"]');
        this.button_inp  = Selector('button[type="submit"]');
    }
    async login (user = undefined, pass = undefined) {
        await t
            .typeText(this.login_inp, user ?? this.user)
            .typeText(this.pass_inp, user ?? this.pass)
            .click(this.button_inp);

        await t.wait(1000)
        await t
            .expect((await get_window_location()).pathname).eql('/dashboard')
            .expect((Selector('.user-sidebar').exists)).ok()
    }
}