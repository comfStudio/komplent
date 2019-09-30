import React from 'react'
import { mount, shallow } from 'enzyme'
import renderer from "react-test-renderer";
import Router from 'next/router'
import CommissionsPage from '@components/App/CommissionsPage'
import { S, getPageProps } from '../../common'

class Page extends CommissionsPage {

    render() {
        return this.renderPage(
            <div/>
        )
    }
}

const SPage = S(Page)

describe('Application Page', () => {
    describe('Page that extends Commission Page', () => {
        it("should match snapshot", async () => {
            const tree = renderer
            .create(<SPage {...(await getPageProps(CommissionsPage))}/>)
            .toJSON()

            expect(tree).toMatchSnapshot()
        });

        it('should render without throwing an error', async () => {
            const wrap = shallow(<SPage {...(await getPageProps(CommissionsPage))}/>)
        })
        
        it('should mount without throwing an error', async () => {
            const wrap = mount(<SPage {...(await getPageProps(CommissionsPage))}/>)
        })
    })
})