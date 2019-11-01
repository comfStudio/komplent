import React from 'react'
import { NextPageContext } from 'next'

import { AuthPage, Props as AuthProps } from '@components/App/AuthPage'
import SettingsLayout from '@components/Settings'
import CommissionsSettings from '@components/Settings/CommissionsSettings'
import { RequireCreator } from '@components/Profile'
import { useCommissionRateStore } from '@store/commission'

interface Props extends AuthProps {
    commissionRateStoreState: object
}

class CommissionSettingsPage extends AuthPage<Props> {

  static async getInitialProps(ctx: NextPageContext) {

    const props = await super.getInitialProps(ctx)

    let commissionRateStoreState = useCommissionRateStore.createState({})
    if (props.useUserState.current_user) {
        commissionRateStoreState = await useCommissionRateStore.actions.load(props.useUserState.current_user)
    }

    return {
        ...props,
        commissionRateStoreState,
    }
    
  }

  public render() {
    return this.renderPage(
    <useCommissionRateStore.Provider initialState={this.props.commissionRateStoreState}>
      <SettingsLayout activeKey="commissions">
        <RequireCreator/>
        <CommissionsSettings/>
      </SettingsLayout>
    </useCommissionRateStore.Provider>
    )
  }
}

export default CommissionSettingsPage
