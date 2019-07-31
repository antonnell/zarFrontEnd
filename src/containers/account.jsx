import React from "react";
import createReactClass from "create-react-class";
import AccountComponent from "../components/account";

let Account = createReactClass({
  getInitialState() {
    return {

    };
  },
  render() {
    return (
      <AccountComponent
        theme={ this.props.theme }
        account={ this.props.account }
        cardClicked={ this.cardClicked }
        transactClicked={ this.props.transactClicked }
        viewMode={ this.props.viewMode }
      />
    );
  },

  cardClicked() {
    let screen = ''

    switch(this.props.account.type) {
      case 'Binance':
      case 'BEP2':
        screen = 'binanceAccounts'
        break
      case 'Ethereum':
      case 'ERC20':
        screen = 'ethAccounts'
        break
      default:
        break
    }

    window.location.hash=screen
  }
});

export default Account;
