import React from 'react'
import DrawerComponent from '../components/drawer'
const createReactClass = require('create-react-class');

let Drawer = createReactClass({
  getInitialState() {
    return {
      options: [
        {
          type: 'header',
          label: 'MENU'
        },
        {
          type: 'item',
          label: 'Accounts',
          selected: ['accounts', 'binanceAccounts', 'ethAccounts'],
          onClick: 'accounts'
        },
        {
          type: 'item',
          label: 'Beneficiaries',
          selected: ['beneficiaries'],
          onClick: 'beneficiaries'
        },
        {
          type: 'item',
          label: 'Asset Management',
          selected: ['assetManagement'],
          onClick: 'assetManagement'
        },
        {
          type: 'item',
          label: 'CSDT',
          selected: ['csdt'],
          onClick: 'csdt'
        },
        {
          type: 'divider'
        },
        {
          type: 'header',
          label: 'PROFILE'
        },
        {
          type: 'item',
          label: 'Settings',
          selected: ['settings'],
          onClick: 'settings'
        },
        {
          type: 'divider'
        },
      ]
    }
  },
  render() {
    return (
      <DrawerComponent
        currentScreen={this.props.currentScreen}
        navClicked={this.props.navClicked}
        closeDrawer={this.props.closeDrawer}
        user={this.props.user}
        open={this.props.open}
        size={this.props.size}
        theme={this.props.theme}
        logUserOut={this.props.logUserOut}
        options={this.state.options}
      />
    )
  }
});

export default (Drawer);
