import React from "react";
import createReactClass from "create-react-class";
import AccountsComponent from "../components/accounts";
import {
  GET_ACCOUNTS,
  GET_ACCOUNTS_RETURNED,
  GET_TRANSACTIONS,
  GET_TRANSACTIONS_RETURNED,
  GET_ASSETS,
  GET_ASSETS_RETURNED,
  GET_NATIVE_DENOMS,
  GET_NATIVE_DENOMS_RETURNED,
  ERROR,
} from '../constants'

const { emitter, dispatcher, store } = require("../store/xarStore.js");

let Accounts = createReactClass({

  getInitialState() {

    return {
      error: null,

      accounts: store.getStore('accounts'),
      transactions: store.getStore('transactions'),
      nativeDenoms: store.getStore('nativeDenoms'),

      loading: true,
      optionsAccount: null,
      editAccount: null,
      editAddressName: '',
      editAddressNameError: null,
      editAddressNameErrorMessage: '',
      cardLoading: false,
      exportKeyAccount: null,
      deleteAddress: null,
      deleteId: null,
      deleteOpen: false,
      mnemonic: null,
      keyOpen: false,
      currentAccountKey: null,
      currentAccountPhrase: null,
      loadingAccount: null,
      viewOpen: false,
      viewAddress: null,
      viewTokensOpen: false,
      viewTokens: null,
      viewTokensAccount: null,
      viewMode: 'Grid',
      accountTypeValue: null,
      accountTypeError: false,
      accountTypeErrorMessage: '',

      viewAssetsOpen: false,
      balances: []
    };
  },

  render() {
    return this.renderAccounts()
  },

  renderAccounts() {
    let {
      theme,
      transactClicked,
      transactClosed,
      transactOpen,
      user
    } = this.props

    let {
      error,
      accounts,
      transactions,
      loading,
      viewMode,
      viewAssetsOpen,
      balances,
      assets,
      nativeDenoms
    } = this.state

    return (
      <AccountsComponent
        error={ error }
        user={ user }
        theme={ theme }
        accounts={ accounts }
        transactions={ transactions }
        loading={ loading }
        transactClicked= { transactClicked }
        transactOpen={ transactOpen }
        transactClosed={ transactClosed }
        handleChange={ this.handleChange }
        handleSelectChange={ this.handleSelectChange }
        toggleViewClicked={ this.toggleViewClicked }
        cardClicked={ this.cardClicked }
        handleViewAssetsClose={ this.handleViewAssetsClose }
        viewMode={ viewMode }
        viewAssetsOpen={ viewAssetsOpen }
        balances={ balances }
        assets={ assets }
        nativeDenoms={ nativeDenoms }
      />
    );
  },

  UNSAFE_componentWillMount() {

    emitter.removeListener(GET_ACCOUNTS_RETURNED, this.accountsUpdated)
    emitter.on(GET_ACCOUNTS_RETURNED, this.accountsUpdated)

    emitter.removeListener(GET_TRANSACTIONS_RETURNED, this.transactionsUpdated)
    emitter.on(GET_TRANSACTIONS_RETURNED, this.transactionsUpdated)

    emitter.removeListener(ERROR, this.showError);
    emitter.on(ERROR, this.showError);

    var content = {};
    dispatcher.dispatch({ type: GET_ACCOUNTS, content });
    dispatcher.dispatch({ type: GET_TRANSACTIONS, content });

    const allAssets = store.getStore('allAssets')
    if(!allAssets || allAssets.length === 0) {
      emitter.removeListener(GET_ASSETS_RETURNED, this.assetsUpdated)
      emitter.on(GET_ASSETS_RETURNED, this.assetsUpdated)
      dispatcher.dispatch({ type: GET_ASSETS, content });
    } else {
      this.setState({
        assets: allAssets
      })
    }

    const nativeDenoms = store.getStore('nativeDenoms')
    if(!nativeDenoms || nativeDenoms.length === 0) {
      emitter.removeListener(GET_NATIVE_DENOMS_RETURNED, this.nativeDenomsUpdated)
      emitter.on(GET_NATIVE_DENOMS_RETURNED, this.nativeDenomsUpdated)
      dispatcher.dispatch({ type: GET_NATIVE_DENOMS, content });
    } else {
      this.setState({
        assets: nativeDenoms
      })
    }
  },

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.showError);
    emitter.removeListener(GET_ACCOUNTS_RETURNED, this.accountsUpdated)
    emitter.removeListener(GET_TRANSACTIONS_RETURNED, this.transactionsUpdated)
    emitter.removeListener(GET_ASSETS_RETURNED, this.assetsUpdated)
    emitter.removeListener(GET_NATIVE_DENOMS, this.nativeDenomsUpdated)
  },

  cardClicked(account) {
    // do a check to see if account is savings account, then show savings summary??
    this.setState({ viewAssetsOpen: true, balances: account.balances, account: account })
  },

  handleViewAssetsClose() {
    this.setState({ viewAssetsOpen: false, balances: [], account: {} })
  },

  nativeDenomsUpdated() {
    this.setState({
      nativeDenoms: store.getStore('nativeDenoms'),
    })
  },

  accountsUpdated() {
    this.setState({
      accounts: store.getStore('accounts'),
      loading: false,
    })
  },

  transactionsUpdated() {
    this.setState({
      transactions: store.getStore('transactions')
    })
  },

  assetsUpdated() {
    this.setState({
      assets: store.getStore('allAssets')
    })
  },

  showError(error) {
    this.setState({ error: error.toString() })
  },

  handleSelectChange(event, value) {
    switch (event.target.name) {
      case 'token':
        this.setState({ tokenValue: event.target.value })
        break;
      default:
        break;
    }
  },

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  },

  toggleViewClicked() {
    this.setState({ viewMode: this.state.viewMode === 'Grid' ? 'List' : 'Grid'})
  },
});

export default Accounts;
