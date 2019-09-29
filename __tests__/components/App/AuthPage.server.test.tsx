import React from 'react'
import AuthPage from '@components/App/AuthPage'
import { getPageProps } from '../../common'

describe('Application Page', () => {
    describe('Auth Page getInitialProps', () => {
        it("should return the required structure on no login", async () => {
            const props = await getPageProps(AuthPage)
            expect(props).toEqual({
                "inverse": false,
                "optional": false,
                "requested_page": "mock",
                "useUserState": {
                    "active_commissions_count": 0,
                    "active_requests_count": 0,
                    "current_user": undefined,
                    "has_selected_usertype": false,
                    "logged_in": false,
                    "user": null
                }
            })
        });

    })
})