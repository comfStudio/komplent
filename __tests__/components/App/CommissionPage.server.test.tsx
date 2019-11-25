import React from 'react'
import CommissionsPage from '@components/App/CommissionsPage'
import { getPageProps } from '../../common'

describe('Application Page', () => {
    describe('Commission Page getInitialProps', () => {
        it('should return the required structure on no login', async () => {
            const props = await getPageProps(CommissionsPage)
            expect(props).toEqual({
                commissionsStoreState: {
                    commissions: [],
                },
                inverse: false,
                optional: false,
                requested_page: 'mock',
                useUserState: {
                    active_commissions_count: 0,
                    active_requests_count: 0,
                    current_user: undefined,
                    has_selected_usertype: false,
                    logged_in: false,
                    user: null,
                },
            })
        })
    })
})
