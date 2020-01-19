import { Selector, t } from 'testcafe'
import { page_url, get_window_location, LoginPage } from './setup'

class Page extends LoginPage {
}


fixture("Login").page(page_url("/login"))

test('Can login successfully', async t => {
    const p = new LoginPage()
    await p.login()
})
