import React from "react";
import createReactClass from "create-react-class";
import CSDTComponent from "../components/csdt";
import CreateCSDTComponent from "../components/createCSDT";
import {
  GET_ACCOUNTS,
  GET_ACCOUNTS_RETURNED,
  GET_NATIVE_DENOMS,
  GET_NATIVE_DENOMS_RETURNED,
  GET_CSDT,
  GET_CSDT_RETURNED,
  GET_CSDT_HISTORY,
  GET_CSDT_HISTORY_RETURNED,
  GET_CSDT_PRICES,
  GET_CSDT_PRICES_RETURNED,
  CREATE_CSDT,
  CREATE_CSDT_RETURNED,
  DEPOSIT_CSDT,
  DEPOSIT_CSDT_RETURNED,
  WITHDRAW_CSDT,
  WITHDRAW_CSDT_RETURNED,
  PAYBACK_CSDT,
  PAYBACK_CSDT_RETURNED,
  GENERATE_CSDT,
  GENERATE_CSDT_RETURNED,
  ERROR,
} from '../constants'

import PageLoader from "../components/pageLoader";
const { emitter, dispatcher, store } = require("../store/xarStore.js");

let CSDT = createReactClass({

  getInitialState() {
    return {
      csdt: store.getStore('csdt'),
      csdtHistory: store.getStore('csdtHistory'),
      csdtPrices: store.getStore('csdtPrices'),
      nativeDenoms: store.getStore('nativeDenoms'),
      accounts: store.getStore('accounts'),

      error: null,
      loading: true,

      collateral: '',
      collateralError: null,
      collateralDenom: 'uftm',
      collateralDenomError: null,
      generated: '',
      generatedError: null,

      minCollateral: 50, //000000
      minimumCollateralizationRatio: 150,
      warningCollateralizationRatio: 30,
      currentPrice: 0,

      maxGenerated: 0,
      maxGeneratedWarning: false,
      maxGeneratedError: false,

      collateralizationRatio: 0,
      collateralizationRatioWarning: false,
      collateralizationRatioError: false,

      liquidationPrice: 0,
      liquidationPriceWarning: false,
      liquidationPriceError: false,

      action: null,
      actionModalOpen: false,

      depositCollateral: 0,
      withdrawCollateral: 0,
      paybackGenerated: 0,
      generateGenerated: 0,
      projectedLiquidationPrice: 0,
      projectedCollateralizationRatio: 0
    };
  },

  render() {
    let {
      theme,
      user
    } = this.props

    let {
      error,
      csdt,
      csdtHistory,
      nativeDenoms,
      accounts,
      loading,
      csdtPrices,
      collateral,
      collateralError,
      collateralDenom,
      collateralDenomError,
      generated,
      generatedError,

      minCollateral,
      minimumCollateralizationRatio,
      warningCollateralizationRatio,
      currentPrice,

      maxGenerated,
      maxGeneratedWarning,
      maxGeneratedError,

      collateralizationRatio,
      collateralizationRatioWarning,
      collateralizationRatioError,

      liquidationPrice,
      liquidationPriceWarning,
      liquidationPriceError,

      action,
      actionModalOpen,

      depositCollateral,
      depositCollateralError,
      withdrawCollateral,
      withdrawCollateralError,
      paybackGenerated,
      paybackGeneratedError,
      generateGenerated,
      generateGeneratedError,

      projectedLiquidationPrice,
      projectedCollateralizationRatio
    } = this.state

    if(!csdt && loading === true) {
      return <PageLoader />
    }

    if(!csdt || !csdt.balances || csdt.balances.length === 0) {
      return <CreateCSDTComponent
        user={ user }
        theme={ theme }
        error={ error }
        loading={ loading }
        csdtPrices={ csdtPrices }
        nativeDenoms={ nativeDenoms }
        accounts={ accounts }

        onCreateClick={ this.onCreateCSDTClick }
        handleChange={ this.handleChange }
        handleSelectChange={ this.handleSelectChange }
        onBlur={ this.onBlur }

        collateral={ collateral }
        collateralError={ collateralError }
        collateralDenom={ collateralDenom }
        collateralDenomError={ collateralDenomError }
        generated={ generated }
        generatedError={ generatedError }
        minCollateral={ minCollateral }
        minimumCollateralizationRatio={ minimumCollateralizationRatio }
        warningCollateralizationRatio={ warningCollateralizationRatio }
        currentPrice={ currentPrice }
        maxGenerated={ maxGenerated }
        maxGeneratedWarning={ maxGeneratedWarning }
        maxGeneratedError={ maxGeneratedError }
        collateralizationRatio={ collateralizationRatio }
        collateralizationRatioWarning={ collateralizationRatioWarning }
        collateralizationRatioError={ collateralizationRatioError }
        liquidationPrice={ liquidationPrice }
        liquidationPriceWarning={ liquidationPriceWarning }
        liquidationPriceError={ liquidationPriceError }
      />
    }

    return <CSDTComponent
      user={ user }
      theme={ theme }
      error={ error }
      loading={ loading }
      csdt={ csdt }
      csdtHistory={ csdtHistory }
      csdtPrices={ csdtPrices }

      accounts={ accounts }
      actionModalOpen={ actionModalOpen }
      action={ action }
      toggleActionModal={ this.toggleActionModal }
      openAction={ this.openAction }
      handleChange={ this.handleChange }
      handleSelectChange={ this.handleSelectChange }
      onSubmitDeposit={ this.onSubmitDeposit }
      onSubmitPayback={ this.onSubmitPayback }
      onSubmitGenerate={ this.onSubmitGenerate }
      onSubmitWithdraw={ this.onSubmitWithdraw }
      onRefreshCSDT={ this.onRefreshCSDT }

      currentPrice={ currentPrice }
      collateralizationRatio={ collateralizationRatio }
      minimumCollateralizationRatio={ minimumCollateralizationRatio }
      warningCollateralizationRatio={ warningCollateralizationRatio }
      maxGenerated={ maxGenerated }
      liquidationPrice={ liquidationPrice }
      minCollateral={ minCollateral }
      generated={ generated }
      collateral={ collateral }
      collateralDenom={ collateralDenom }

      depositCollateral={ depositCollateral }
      depositCollateralError={ depositCollateralError }
      withdrawCollateral={ withdrawCollateral }
      withdrawCollateralError={ withdrawCollateralError }
      paybackGenerated={ paybackGenerated }
      paybackGeneratedError={ paybackGeneratedError }
      generateGenerated={ generateGenerated }
      generateGeneratedError={ generateGeneratedError }
      projectedLiquidationPrice={ projectedLiquidationPrice }
      projectedCollateralizationRatio={projectedCollateralizationRatio}
    />
  },

  UNSAFE_componentWillMount() {

    emitter.removeListener(GET_CSDT_RETURNED, this.csdtUpdated)
    emitter.on(GET_CSDT_RETURNED, this.csdtUpdated)

    emitter.removeListener(GET_CSDT_HISTORY_RETURNED, this.csdtHistoryUpdated)
    emitter.on(GET_CSDT_HISTORY_RETURNED, this.csdtHistoryUpdated)

    emitter.removeListener(GET_CSDT_PRICES_RETURNED, this.csdtPricesUpdated)
    emitter.on(GET_CSDT_PRICES_RETURNED, this.csdtPricesUpdated)

    emitter.removeListener(CREATE_CSDT_RETURNED, this.createCSDTReturned)
    emitter.on(CREATE_CSDT_RETURNED, this.createCSDTReturned)

    emitter.removeListener(DEPOSIT_CSDT_RETURNED, this.createCSDTReturned)
    emitter.on(DEPOSIT_CSDT_RETURNED, this.createCSDTReturned)

    emitter.removeListener(WITHDRAW_CSDT_RETURNED, this.createCSDTReturned)
    emitter.on(WITHDRAW_CSDT_RETURNED, this.createCSDTReturned)

    emitter.removeListener(GENERATE_CSDT_RETURNED, this.createCSDTReturned)
    emitter.on(GENERATE_CSDT_RETURNED, this.createCSDTReturned)

    emitter.removeListener(PAYBACK_CSDT_RETURNED, this.createCSDTReturned)
    emitter.on(PAYBACK_CSDT_RETURNED, this.createCSDTReturned)

    emitter.removeListener(GET_NATIVE_DENOMS_RETURNED, this.nativeDenomsUpdated)
    emitter.on(GET_NATIVE_DENOMS_RETURNED, this.nativeDenomsUpdated)

    emitter.removeListener(GET_ACCOUNTS_RETURNED, this.getAccountsUpdated)
    emitter.on(GET_ACCOUNTS_RETURNED, this.getAccountsUpdated)

    emitter.removeListener(ERROR, this.showError);
    emitter.on(ERROR, this.showError);

    dispatcher.dispatch({ type: GET_CSDT, content: { } });
    dispatcher.dispatch({ type: GET_CSDT_PRICES, content: {} });

    if(!this.state.nativeDenoms || this.state.nativeDenoms.length == 0) {
      dispatcher.dispatch({ type: GET_NATIVE_DENOMS, content: {} })
    }

    if(!this.state.accounts || this.state.accounts.length == 0) {
      dispatcher.dispatch({ type: GET_ACCOUNTS, content: {} });
    }
  },

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.showError);
    emitter.removeListener(GET_CSDT_RETURNED, this.csdtUpdated)
    emitter.removeListener(GET_CSDT_HISTORY_RETURNED, this.csdtHistoryUpdated)
    emitter.removeListener(GET_CSDT_PRICES_RETURNED, this.csdtPricesUpdated)
    emitter.removeListener(CREATE_CSDT_RETURNED, this.createCSDTReturned)
    emitter.removeListener(DEPOSIT_CSDT_RETURNED, this.createCSDTReturned)
    emitter.removeListener(WITHDRAW_CSDT_RETURNED, this.createCSDTReturned)
    emitter.removeListener(GENERATE_CSDT_RETURNED, this.createCSDTReturned)
    emitter.removeListener(PAYBACK_CSDT_RETURNED, this.createCSDTReturned)
    emitter.removeListener(GET_NATIVE_DENOMS_RETURNED, this.nativeDenomsUpdated)
    emitter.removeListener(GET_ACCOUNTS_RETURNED, this.getAccountsUpdated)
  },

  onRefreshCSDT() {
    this.setState({ loading: true })
    dispatcher.dispatch({ type: GET_ACCOUNTS, content: { } });
    dispatcher.dispatch({ type: GET_CSDT, content: { } });
    dispatcher.dispatch({ type: GET_CSDT_PRICES, content: {} });
  },

  onSubmitDeposit() {
    if(this.validateSubmitDeposit()) {

      const {
        depositCollateral,
        collateralDenom
      } = this.state

      const content = {
        deposit_denom: collateralDenom,
        deposit_amount: depositCollateral
      }

      this.setState({ loading: true })

      dispatcher.dispatch({ type: DEPOSIT_CSDT, content });
    }
  },

  validateSubmitDeposit() {
    this.setState({
      depositCollateralError: null,
      collateralDenomError: null
    })

    const {
      depositCollateral,
      collateralDenom,
      minCollateral
    } = this.state

    let error = false

    if(!depositCollateral || depositCollateral ===  "") {
      this.setState({ depositCollateralError: 'Deposit amount is required' })
      error = true
    }

    if(parseInt(depositCollateral) < parseInt(minCollateral)) {
      this.setState({ depositCollateralError: 'Deposit amount is too low' })
      error = true
    }

    if(!collateralDenom || collateralDenom ===  "") {
      this.setState({ collateralDenomError: 'Deposit denomination is required' })
      error = true
    }

    return !error
  },

  onSubmitPayback() {
    if(this.validateSubmitPayback()) {

      const {
        paybackGenerated,
        collateralDenom
      } = this.state

      const content = {
        payback_denom: collateralDenom,
        payback_amount: paybackGenerated
      }

      this.setState({ loading: true })

      dispatcher.dispatch({ type: PAYBACK_CSDT, content });
    }
  },

  validateSubmitPayback() {
    this.setState({
      paybackGeneratedError: null,
      collateralDenomError: null
    })

    const {
      paybackGenerated,
      collateralDenom,
      maxGenerated
    } = this.state

    let error = false

    if(!paybackGenerated || paybackGenerated ===  "") {
      this.setState({ paybackGeneratedError: 'Generation amount is required' })
      error = true
    }

    // if(paybackGenerated > maxGenerated) {
    //   this.setState({ paybackGeneratedError: 'Generation amount is too low' })
    //   error = true
    // }

    if(!collateralDenom || collateralDenom ===  "") {
      this.setState({ collateralDenomError: 'Generated denomination is required' })
      error = true
    }

    return !error
  },

  onSubmitGenerate() {
    if(this.validateSubmitGenerate()) {

      const {
        generateGenerated,
        collateralDenom
      } = this.state

      const content = {
        generate_denom: collateralDenom,
        generate_amount: generateGenerated
      }

      this.setState({ loading: true })

      dispatcher.dispatch({ type: GENERATE_CSDT, content });
    }
  },

  validateSubmitGenerate() {
    this.setState({
      generateGeneratedError: null,
      collateralDenomError: null
    })

    const {
      generateGenerated,
      collateralDenom,
      maxGenerated
    } = this.state

    let error = false

    if(!generateGenerated || generateGenerated ===  "") {
      this.setState({ generateGeneratedError: 'Generation amount is required' })
      error = true
    }

    if(parseInt(generateGenerated) > parseInt(maxGenerated)) {
      this.setState({ generateGeneratedError: 'Generation amount is too low' })
      error = true
    }

    if(!collateralDenom || collateralDenom ===  "") {
      this.setState({ collateralDenomError: 'Generated denomination is required' })
      error = true
    }

    return !error
  },

  onSubmitWithdraw() {
    if(this.validateSubmitWithdraw()) {

      const {
        withdrawCollateral,
        collateralDenom
      } = this.state

      const content = {
        withdraw_denom: collateralDenom,
        withdraw_amount: withdrawCollateral
      }

      this.setState({ loading: true })

      dispatcher.dispatch({ type: WITHDRAW_CSDT, content });
    }
  },

  validateSubmitWithdraw() {
    this.setState({
      withdrawCollateralError: null,
      collateralDenomError: null
    })

    const {
      withdrawCollateral,
      collateralDenom,
      maxWithdrawable
    } = this.state

    let error = false

    if(!withdrawCollateral || withdrawCollateral ===  "") {
      this.setState({ withdrawCollateralError: 'Generation amount is required' })
      error = true
    }

    if(parseInt(withdrawCollateral) > parseInt(maxWithdrawable)) {
      this.setState({ withdrawCollateralError: 'Generation amount is too low' })
      error = true
    }

    if(!collateralDenom || collateralDenom ===  "") {
      this.setState({ collateralDenomError: 'Generated denomination is required' })
      error = true
    }

    return !error
  },

  openAction(action) {
    this.setState({
      action: action,
      actionModalOpen: true
    })
  },

  toggleActionModal() {
    this.setState({
      action: null,
      actionModalOpen: false
    })
  },

  handleSelectChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })

    setTimeout(this.calculatePriceInfo,  20)
  },

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });


    if(['collateral', 'generated'].includes(event.target.id)) {
      this.setState({ collateralError: false, generatedError: false })

      let that = this

      const id = event.target.id

      setTimeout(() => {
        const {
          collateral,
          collateralDenom,
          generated,
          minimumCollateralizationRatio,
          csdtPrices
        } = this.state

        const ratios = this.calculateRatios(collateral, collateralDenom, generated, minimumCollateralizationRatio, csdtPrices)

        that.setState({
          currentPrice: ratios.currentPrice,
          collateralizationRatio: ratios.collateralizationRatio,
          liquidationPrice: ratios.liquidationPrice,
        })

        if(id === 'collateral') {
          this.setState( { maxGenerated: ratios.maxGenerated } )
        }

        setTimeout(that.validateOnBlur, 100)
      }, 20)
    }

    if(['depositCollateral'].includes(event.target.id)) {
      let that = this

      setTimeout(() => {
        const {
          csdt,
          collateralDenom,
          minimumCollateralizationRatio,
          csdtPrices,
          depositCollateral
        } = this.state

        const ratios = this.calculateRatios((parseFloat(csdt.collateral)+parseFloat(depositCollateral)), collateralDenom, csdt.generated, minimumCollateralizationRatio, csdtPrices)

        that.setState({
          projectedCollateralizationRatio: ratios.collateralizationRatio,
          projectedLiquidationPrice: ratios.liquidationPrice,
        })

        setTimeout(that.validateOnBlur, 100)
      }, 20)
    }

    if(['withdrawCollateral'].includes(event.target.id)) {
      let that = this

      setTimeout(() => {
        const {
          csdt,
          collateralDenom,
          minimumCollateralizationRatio,
          csdtPrices,
          withdrawCollateral
        } = this.state

        const ratios = this.calculateRatios((parseFloat(csdt.collateral)-parseFloat(withdrawCollateral)), collateralDenom, csdt.generated, minimumCollateralizationRatio, csdtPrices)

        that.setState({
          projectedCollateralizationRatio: ratios.collateralizationRatio,
          projectedLiquidationPrice: ratios.liquidationPrice,
        })

        setTimeout(that.validateOnBlur, 100)
      }, 20)
    }

    if(['paybackGenerated'].includes(event.target.id)) {
      let that = this

      setTimeout(() => {
        const {
          csdt,
          collateralDenom,
          minimumCollateralizationRatio,
          csdtPrices,
          paybackGenerated
        } = this.state

        const ratios = this.calculateRatios(csdt.collateral, collateralDenom, (parseFloat(csdt.generated) - parseFloat(paybackGenerated)), minimumCollateralizationRatio, csdtPrices)

        that.setState({
          projectedCollateralizationRatio: ratios.collateralizationRatio,
          projectedLiquidationPrice: ratios.liquidationPrice,
        })

        setTimeout(that.validateOnBlur, 100)
      }, 20)
    }

    if(['generateGenerated'].includes(event.target.id)) {
      let that = this

      setTimeout(() => {
        const {
          csdt,
          collateralDenom,
          minimumCollateralizationRatio,
          csdtPrices,
          generateGenerated
        } = this.state

        const ratios = this.calculateRatios(csdt.collateral, collateralDenom, (parseFloat(csdt.generated) + parseFloat(generateGenerated)), minimumCollateralizationRatio, csdtPrices)

        that.setState({
          projectedCollateralizationRatio: ratios.collateralizationRatio,
          projectedLiquidationPrice: ratios.liquidationPrice,
        })

        setTimeout(that.validateOnBlur, 100)
      }, 20)
    }

  },

  calculateRatios(collateral, collateralDenom, generated, minimumCollateralizationRatio, csdtPrices) {
    let currentPrice = 0
    let liquidationPrice = 0
    let collateralizationRatio = 0
    let maxGenerated = 0
    let maxWithdraw = 0

    if(csdtPrices && csdtPrices.length > 0) {
      const price = csdtPrices.filter((price) => {
        return price.asset_code === collateralDenom
      })

      if(price.length > 0) {
        currentPrice = parseFloat(price[0].price)

        if(collateral && collateral !== "") {
          if(generated > 0) {
            collateralizationRatio = parseFloat(currentPrice * parseFloat(collateral) * 100 / generated).toFixed(4)
            maxWithdraw = Math.floor((collateral - (collateral * minimumCollateralizationRatio / collateralizationRatio))).toFixed(0)
            liquidationPrice = (collateralizationRatio * currentPrice / minimumCollateralizationRatio).toFixed(4)
          }

          maxGenerated = Math.floor(((collateral * currentPrice * 100 / minimumCollateralizationRatio) - generated)).toFixed(0)
        }

        return {
          currentPrice,
          collateralizationRatio,
          liquidationPrice,
          maxGenerated,
          maxWithdraw,
        }
      }
    }

    return {
      currentPrice,
      collateralizationRatio,
      liquidationPrice,
      maxGenerated,
      maxWithdraw
    }
  },

  nativeDenomsUpdated() {
    this.setState({
      nativeDenoms: store.getStore('nativeDenoms'),
    })
  },

  getAccountsUpdated() {
    this.setState({
      accounts: store.getStore('accounts'),
    })
  },

  csdtUpdated() {
    this.setState({
      csdt: store.getStore('csdt'),
      loading: false,
    })

    setTimeout(this.calculatePriceInfo,  20)
  },

  calculatePriceInfo() {

    const {
      csdt,
      csdtPrices,
      minimumCollateralizationRatio,
      collateralDenom
    } = this.state

    if(csdt && csdtPrices && csdtPrices.length > 0) {
      if(csdt && csdt.balances) {
        csdt.balances.filter((balance) => {
          return balance.collateral_denom === collateralDenom
        }).map((balance) => {
          let debt = 0
          let col = 0

          if(balance.debt && balance.debt.length > 0) {
            debt = balance.debt[0].amount
          }

          if(balance.collateral_amount && balance.collateral_amount.length > 0) {
            col = balance.collateral_amount[0].amount
          }
          const generated = parseInt(debt)
          const collateral = parseInt(col)

          const ratios = this.calculateRatios(collateral, collateralDenom, generated, minimumCollateralizationRatio, csdtPrices)

          csdt.collateral = collateral
          csdt.generated = generated
          csdt.maxGenerated = ratios.maxGenerated
          csdt.maxWithdraw = ratios.maxWithdraw

          this.setState({
            csdt: csdt,
            currentPrice: ratios.currentPrice,
            collateralizationRatio: ratios.collateralizationRatio,
            liquidationPrice: ratios.liquidationPrice,
            maxGenerated: ratios.maxGenerated,
          })
        })
      }
    }
  },

  createCSDTReturned(error, data) {
    if(error) {
      this.setState({
        loading: false,
        error: error.toString()
      });
      return
    }

    if (data.success) {
      setTimeout(() => {
        this.setState({
          csdt: data.result,
          error: null
        })

        setTimeout(this.calculatePriceInfo, 20)
        this.toggleActionModal()
      }, 20)
    } else {
      this.setState({
        loading: false,
        error: data.result,
      });
    }
  },

  csdtHistoryUpdated() {
    this.setState({
      csdtHistory: store.getStore('csdtHistory')
    })
  },

  csdtPricesUpdated() {
    this.setState({
      csdtPrices: store.getStore('csdtPrices')
    })
  },

  showError(error) {
    this.setState({ error: error.toString() })
  },

  onCreateCSDTClick() {
    if(this.validateCreateCSDT()) {

      const {
        collateral,
        collateralDenom,
        generated
      } = this.state

      const content = {
        deposit_denom: collateralDenom,
        deposit_amount: collateral,
        generated_amount: generated
      }

      this.setState({ loading: true })

      dispatcher.dispatch({ type: CREATE_CSDT, content });
    }
  },

  onBlur() {
    setTimeout(this.validateOnBlur, 100)
  },

  validateOnBlur() {

    const {
      collateral,
      generated,
      generatedError,
      collateralizationRatio,
      minimumCollateralizationRatio,
      warningCollateralizationRatio
    } = this.state

    if(collateral && collateral !== "" && generated && generated !== "") {
      if(collateralizationRatio < minimumCollateralizationRatio) {
        this.setState({
          collateralizationRatioError: 'Your collateral is below the minimum collateralization ratio',
          liquidationPriceError: 'Your collateral is below the minimum collateralization ratio',
          maxGeneratedError: 'Your collateral is below the minimum collateralization ratio',
          generatedError: 'Your collateral is below the minimum collateralization ratio'
        })

        return
      }
      if(collateralizationRatio < minimumCollateralizationRatio + warningCollateralizationRatio) {
        this.setState({
          collateralizationRatioError: false,
          liquidationPriceError: false,
          maxGeneratedError: false,
          generatedError: false,
          collateralizationRatioWarning: 'Your collateral is at risk of being put up for auction',
          liquidationPriceWarning: 'Your collateral is at risk of being put up for auction',
          maxGeneratedWarning: 'Your collateral is at risk of being put up for auction'
        })

        return
      }
    }

    this.setState({
      collateralizationRatioError: false,
      liquidationPriceError: false,
      maxGeneratedError: false,
      generatedError: false,
      collateralizationRatioWarning: false,
      liquidationPriceWarning: false,
      maxGeneratedWarning: false,
    })
  },

  validateCreateCSDT() {
    this.setState({
      collateralError: null,
      collateralDenomError: null,
      generatedError: null
    })

    const {
      collateral,
      minCollateral,
      collateralDenom,
      generated,
      maxGenerated,
      accounts
    } = this.state

    let error = false

    if(!collateral || collateral ===  "") {
      this.setState({ collateralError: 'Deposit amount is required' })
      error = true
    }

    if(parseInt(collateral) < parseInt(minCollateral)) {
      this.setState({ collateralError: 'Deposit amount is too low' })
      error = true
    }

    let accountBalance = 0

    if(accounts && accounts.length > 0) {
      let account = accounts.filter((acc) => {
        return acc.account_type === 'XAR'
      })

      if(account.length > 0) {
        if(account[0].balances && account[0].balances.length > 0) {
          const balance = account[0].balances.filter((bal) => {
            return bal.denom === collateralDenom
          })

          accountBalance = balance.length > 0 ? parseInt(balance[0].amount) : 0
        }
      }
    }

    if(parseInt(collateral) > parseInt(accountBalance)) {
      this.setState({ collateralError: 'Deposit amount greater than account balance' })
      error = true
    }

    if(!collateralDenom || collateralDenom ===  "") {
      this.setState({ collateralDenomError: 'Deposit denomination is required' })
      error = true
    }

    if(!generated || generated ===  "") {
      this.setState({ generatedError: 'Generated amount is required' })
      error = true
    }

    if(parseInt(generated) > parseInt(maxGenerated)) {
      this.setState({ generatedError: 'Generated amount is too high' })
      error = true
    }

    return !error
  }
});

export default CSDT;
