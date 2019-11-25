import React from 'react'
import { mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import MainLayout from '@components/App/MainLayout'
import { S } from '../../common'

const SMainLayout = S(MainLayout)

describe('Application', () => {
    describe('Main layout', () => {
        it('should match snapshot', () => {
            const props = {}

            const tree = renderer.create(<SMainLayout {...props} />).toJSON()

            expect(tree).toMatchSnapshot()
        })

        it('should render without throwing an error', function() {
            const wrap = shallow(<SMainLayout />)
        })

        it('should mount without throwing an error', function() {
            const wrap = mount(<SMainLayout />)
        })
    })
})
