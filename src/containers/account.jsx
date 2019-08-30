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
        cardClicked={ this.props.cardClicked }
        transactClicked={ this.props.transactClicked }
        viewMode={ this.props.viewMode }
      />
    );
  },
});

export default Account;
