import React from 'react'
import TokenSwapComponent from '../components/tokenSwap'
const createReactClass = require('create-react-class')

let ethEmitter = require("../store/ethStore.js").default.emitter;
let ethDispatcher = require("../store/ethStore.js").default.dispatcher;
let ethStore = require("../store/ethStore.js").default.store;

let bnbEmitter = require("../store/binanceStore.js").default.emitter;
let bnbDispatcher = require("../store/binanceStore.js").default.dispatcher;
let bnbStore = require("../store/binanceStore.js").default.store;

let TokenSwap = createReactClass({
  getInitialState() {
    const ethAccounts = ethStore.getStore('accounts')
    const bnbAccounts = bnbStore.getStore('accounts')

    return {
      ethLoading: true,
      bnbLoading: true,
      error: null,
      message: '',
      ethAccountValue: '',
      ethAccountError: false,
      ethAccountErrorMessage: '',
      ethAccountOptions: ethAccounts,
      bnbAccountValue: '',
      bnbAccountError: false,
      bnbAccountErrorMessage: '',
      bnbAccountOptions: bnbAccounts,
      curveBalance: null,
      ethCurveBalance: null,
      tabValue: 0,
      tokenOptions: [
        { value: 'Binance', description: "Binance", icon: "Binance"},
        { value: 'Ethereum', description: "ERC-20", icon: "Ethereum"}
      ],
      sendToken: 'Binance',
      receiveToken: "Ethereum",
      sendValue: '0',
      sendError: false,
      sendErrorMessage: '',
      receiveValue: '0'
    }
  },

  render() {

    const {
      ethLoading,
      bnbLoading,
      error,
      ethAccountValue,
      ethAccountError,
      ethAccountErrorMessage,
      ethAccountOptions,
      bnbAccountValue,
      bnbAccountError,
      bnbAccountErrorMessage,
      bnbAccountOptions,
      curveBalance,
      ethCurveBalance,
      message,
      tabValue,
      tokenOptions,
      sendToken,
      receiveToken,
      sendValue,
      sendError,
      sendErrorMessage,
      receiveValue,
    } = this.state

    const {
      theme,
      user
    } = this.props

    return (
      <TokenSwapComponent
        handleSelectChange={ this.handleSelectChange }
        handleChange={ this.handleChange }
        swapTokens={ this.swapTokens }
        handleTabChange={ this.handleTabChange }

        theme={ theme }
        user={ user }

        error={ error }
        message={ message }
        loading={ ethLoading || bnbLoading }
        ethAccountValue={ ethAccountValue }
        ethAccountError={ ethAccountError }
        ethAccountErrorMessage={ ethAccountErrorMessage }
        ethAccountOptions={ ethAccountOptions }
        bnbAccountValue={ bnbAccountValue }
        bnbAccountError={ bnbAccountError }
        bnbAccountErrorMessage={ bnbAccountErrorMessage }
        bnbAccountOptions={ bnbAccountOptions }
        curveBalance={ curveBalance }
        ethCurveBalance={ ethCurveBalance }
        tabValue={ tabValue }
        tokenOptions={ tokenOptions }
        sendToken={ sendToken }
        receiveToken={ receiveToken }
        sendValue={ sendValue }
        sendError={ sendError }
        sendErrorMessage={ sendErrorMessage }
        receiveValue={ receiveValue }
      />
    )
  },


  componentWillMount() {
    ethEmitter.removeAllListeners('accountsUpdated');
    bnbEmitter.removeAllListeners("accountsUpdated");

    ethEmitter.on('accountsUpdated', this.ethAccountsRefreshed);
    bnbEmitter.on('accountsUpdated', this.bnbAccountsRefreshed);

    ethEmitter.removeAllListeners("convertCurve");
    bnbEmitter.removeAllListeners("convertCurve")
    ethEmitter.on('convertCurve', this.convertCurveReturned)
    bnbEmitter.on('convertCurve', this.convertCurveReturned)

    this.getAllAccounts()
  },

  convertCurveReturned(err, data) {
    if(data.success) {
      this.setState({ message: 'Transaction successfully submitted', ethAccountValue: '', bnbAccountValue: '', sendValue: '', receiveValue: '' })
    } else {
      this.setState({ error: data.errorMsg })
    }
  },

  bnbAccountsRefreshed() {
    const accounts = bnbStore.getStore('accounts')
    let val = null;
    if(accounts) {
      val = accounts.map((acc) => {
        let token = acc.balances.filter((tokenAccount) => {
          return tokenAccount.symbol === 'CURV-80B'
        })

        let balance = null

        if(token.length > 0) {
          balance = token[0].free
        }

        return {
          description: acc.name,
          value: acc.address,
          balance: balance,
          symbol: 'CURV-80B'
        }
      })
    }
    this.setState({
      bnbAccounts: accounts,
      bnbAccountOptions: val,
      bnbLoading: false,
    })
  },

  ethAccountsRefreshed() {
    const accounts = ethStore.getStore('accounts')
    let val = null;
    if(accounts) {
      val = accounts.map((acc) => {
        let token = acc.tokens.filter((tokenAccount) => {
          return tokenAccount.name === 'Curve'
        })

        let balance = null

        if(token.length > 0) {
          balance = token[0].balance
        }

        return {
          description: acc.name,
          value: acc.address,
          balance: balance,
          symbol: 'CURV'
        }
      })
    }
    this.setState({
      ethAccounts: accounts,
      ethAccountOptions: val,
      ethLoading: false,
    })
  },

  getAllAccounts() {
    const { user } = this.props;
    const content = { id: user.id };

    ethDispatcher.dispatch({
      type: 'getEthAddress',
      content,
      token: user.token
    });
    bnbDispatcher.dispatch({
      type: 'getBinanceAddress',
      content,
      token: user.token
    });
  },

  handleSelectChange(event) {
    switch (event.target.name) {
      case 'ethAccount':
        this.setState({ ethAccountValue: event.target.value, ethAccountError: false, ethAccountErrorMessage: '' })
        break;
      case 'bnbAccount':
        this.setState({ bnbAccountValue: event.target.value, bnbAccountError: false, bnbAccountErrorMessage: '' })
        break;
      case 'sendToken':
        let receiveToken = null

        switch(event.target.value) {
          case 'Ethereum':
            receiveToken = 'Binance'
            break;
          case  'Binance':
            receiveToken = 'Ethereum'
            break;
        }
        this.setState({ sendToken: event.target.value, receiveToken })
        break;
      case 'receiveToken':
        let sendToken = null

        switch(event.target.value) {
          case 'Ethereum':
            sendToken = 'Binance'
            break;
          case  'Binance':
            sendToken = 'Ethereum'
            break;
        }

        this.setState({ receiveToken: event.target.value, sendToken })
        break;
      default:

    }
  },

  handleChange(event) {
    switch (event.target.name) {
      case 'send':
        this.setState({ sendValue: event.target.value, receiveValue: event.target.value, sendError: false, sendErrorMessage: '' })
        break;
      default:

    }
  },

  validateSwap() {
    this.setState({
      sendError: false,
      sendErrorMessage: "",
      bnbAccountError: false,
      bnbAccountErrorMessage: '',
      ethAccountError: false,
      ethAccountErrorMessage: ''
    })

    const {
      sendValue,
      bnbAccountValue,
      ethAccountValue
    } = this.state

    let error = false

    if(sendValue === null || sendValue === "0") {
      this.setState({ sendError: true, sendErrorMessage: 'Amount is required' })
      error = true
    }

    if(ethAccountValue === null || ethAccountValue === "") {
      this.setState({ ethAccountError: true, ethAccountErrorMessage: 'Eth account is required' })
      error = true
    }

    if(bnbAccountValue === null || bnbAccountValue === "") {
      this.setState({ bnbAccountError: true, bnbAccountErrorMessage: 'BNB account is required' })
      error = true
    }

    return !error
  },

  swapTokens() {
    if (this.validateSwap()) {

      const { user } = this.props

      const {
        sendToken,
        receiveToken,
        sendValue,
        ethAccountValue,
        bnbAccountValue
      } = this.state

      let content = null

      switch (sendToken) {
        case 'Ethereum':
          content = {
            amount: sendValue,
            sourceAddress: ethAccountValue,
            destinationAddress: receiveToken === 'Binance' ? bnbAccountValue : null,
            destinationChain: receiveToken === 'Binance' ? "BINANCE" : "ETH",
            id: user.id
          }

          this.setState({ ethLoading: true, error: null })

          ethDispatcher.dispatch({
            type: "convertCurve",
            content,
            token: user.token
          });
          break;
        case 'Binance':
          content = {
            amount: sendValue,
            sourceAddress: bnbAccountValue,
            destinationAddress: receiveToken === 'Ethereum' ? ethAccountValue : null,
            destinationChain: receiveToken === 'Ethereum' ? "ETH" : 'BINANCE',
            id: user.id
          }

          this.setState({ bnbLoading: true, error: null })

          bnbDispatcher.dispatch({
            type: "convertCurve",
            content,
            token: user.token
          });
          break;
        default:
          return false
      }
    }
  },

  handleTabChange(event, tabValue) {
    this.setState({ tabValue });
  },

})

export default (TokenSwap);
