import React from 'react'
import { mount, shallow } from 'enzyme'
import renderer from "react-test-renderer";
import Router from 'next/router'
import AuthPage from '@components/App/AuthPage'
import { S, getPageProps } from '../../common'

class Page extends AuthPage {

    render() {
        return this.renderPage(
            <div/>
        )
    }
}

const SPage = S(Page)

describe('Application Page', () => {
    describe('Page that extends Auth Page', () => {
        it("should match snapshot", async () => {
            const tree = renderer
            .create(<SPage {...(await getPageProps(AuthPage))}/>)
            .toJSON()

            expect(tree).toMatchSnapshot()
        });

        it('should render without throwing an error', async () => {
            const wrap = shallow(<SPage {...(await getPageProps(AuthPage))}/>)
        })
        
        it('should mount without throwing an error', async () => {
            const wrap = mount(<SPage {...(await getPageProps(AuthPage))}/>)
        })
        
        it('should redirect on no login', async () => {
            const wrap = mount(<SPage {...(await getPageProps(AuthPage))}/>)
            expect(Router.replace).toHaveBeenCalledWith("mock", '/login', {shallow: true})
        })
    })
})