import React from 'react'
import { mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Router from 'next/router'
import unfetch from 'isomorphic-unfetch'

import AuthPage from '@components/App/AuthPage'
import * as common from '../../common'
import { S, getPageProps } from '../../common'
import * as user from '@store/user'
import cookies from 'nookies'
import * as request from '@utility/request'

class Page extends AuthPage {
    render() {
        return this.renderPage(<div />)
    }
}

const SPage = S(Page)

describe('Application Page', () => {
    describe('Page that extends Auth Page', () => {
        afterEach(() => {
            Router.replace.mockClear()
        })

        it('should match snapshot', async () => {
            const tree = renderer
                .create(<SPage {...await getPageProps(AuthPage)} />)
                .toJSON()

            expect(tree).toMatchSnapshot()
        })

        it('should render without throwing an error', async () => {
            const wrap = shallow(<SPage {...await getPageProps(AuthPage)} />)
        })

        it('should mount without throwing an error', async () => {
            const wrap = mount(<SPage {...await getPageProps(AuthPage)} />)
        })

        it('should redirect on no login', async () => {
            const wrap = mount(<SPage {...await getPageProps(AuthPage)} />)
            expect(Router.replace).toHaveBeenCalledWith('mock', '/login', {
                shallow: true,
            })
        })

        it('should not redirect on login', async () => {
            common.setupAuth()
            common.setupCommissions()
            jest.spyOn(user, 'fetch_user')
            jest.spyOn(request, 'fetch')
            const wrap = mount(<SPage {...await getPageProps(AuthPage)} />)
            expect(user.fetch_user).toHaveBeenCalledWith(cookies.get({}))
            expect(request.fetch).toHaveBeenCalled()
            expect(unfetch).toHaveBeenCalled()
            expect(user.fetch_user).toHaveReturnedWith(
                expect.objectContaining({
                    _id: expect.any(String),
                })
            )
            expect(Router.replace).not.toHaveBeenCalled()
            common.resetAuth()
            common.resetCommissions()
        })
    })
})
