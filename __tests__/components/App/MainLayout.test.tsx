import React from 'react'
import { mount } from 'enzyme'
import renderer from "react-test-renderer";
import MainLayout from '@components/App/MainLayout'

describe('Application', () => {
    describe('Main layout', () => {
        it("should match snapshot", () => {
            const props = { }

            const tree = renderer
            .create(<MainLayout {...props} />)
            .toJSON()

            expect(tree).toMatchSnapshot()
        });

        it('should render without throwing an error', function () {
            const wrap = mount(<MainLayout/>)
        })

    })
})