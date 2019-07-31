import React from "react";
import SetupPayment from "../components/setupPayment";
import ConfirmPayment from "../components/confirmPayment";
import CompletePayment from "../components/completePayment";
import ReceivePayment from "../components/receivePayment";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Grid,
  Slide,
  Dialog,
  Tab,
  Tabs,
  Button
} from "@material-ui/core";
import SectionLoader from '../components/sectionLoader';

const createReactClass = require("create-react-class");
var QRCode = require("qrcode");

let ethEmitter = require("../store/ethStore.js").default.emitter;
let ethDispatcher = require("../store/ethStore.js").default.dispatcher;
let ethStore = require("../store/ethStore.js").default.store;

let binanceEmitter = require('../store/binanceStore.js').default.emitter;
let binanceDispatcher = require('../store/binanceStore.js').default.dispatcher;
let binanceStore = require('../store/binanceStore.js').default.store;

let contactsStore = require("../store/contactsStore.js").default.store;


function Transition(props) {
  return <Slide direction="up" {...props} />;
}

let Transact = createReactClass({
  getInitialState() {

    let ethAccounts = ethStore.getStore('accounts')
    let binanceAccounts = binanceStore.getStore('accounts')

    let erc20AccountsCombined = ethStore.getStore('erc20AccountsCombined')
    let bep2AccountsCombined = binanceStore.getStore('bep2AccountsCombined')

    let accountValue = this.props.transactAccount ? this.props.transactAccount : null

    if(this.props.transactCurrency && !this.props.transactAccount) {
      switch(this.props.transactCurrency.type) {
        case "BEP2" :
        case "Binance" :
          accountValue = binanceAccounts && binanceAccounts.length ? binanceAccounts.filter((account) => {
            return account.isPrimary === true
          })[0].address : ""
        break;
        case "ERC20" :
        case "Ethereum" :
          accountValue = ethAccounts && ethAccounts.length ? ethAccounts.filter((account) => {
            return account.isPrimary === true
          })[0].address : ""
        break;
        default:
          break;
      }
    }

    let erc20 = erc20AccountsCombined ? erc20AccountsCombined.map((account) => {
      return {
        value: account.name,
        description: account.name,
        symbol: account.symbol,
        gasSymbol: 'WEI'
      }
    }) : []

    let bep2 = bep2AccountsCombined ? bep2AccountsCombined.map((account) => {
      return {
        value: account.name,
        description: account.name,
        symbol: account.symbol,
        gasSymbol: 'BNB'
      }
    }) : []

    return {
      ethAccounts: ethAccounts,
      binanceAccounts: binanceAccounts,
      erc20AccountsCombined: erc20AccountsCombined,
      bep2AccountsCombined: bep2AccountsCombined,
      contacts: contactsStore.getStore('contacts'),
      ethLoading: false,
      binanceLoading: false,
      contactsLoading: true,

      loading: false,
      error: null,

      tabValue: 0,
      currentScreen: "setup",
      steps: [
        "Set Up Payment",
        "Confirm Details",
        "Results"
      ],
      activeStep: 0,
      completed: {},

      accountValue: accountValue,
      tokens: [
        { value: 'Binance', description: 'Binance', symbol: 'BNB', gasSymbol: 'BNB' },
        { value: 'Ethereum', description: 'Ethereum', symbol: 'ETH', gasSymbol: 'WEI' },
        ...erc20,
        ...bep2
      ],
      tokenValue: this.props.transactCurrency ? this.props.transactCurrency.name : null,
      typeOptions: [
        {  value: 'contact', description: 'Contact' },
        {  value: 'public', description: 'Public Address' },
        {  value: 'own', description: 'Own Account' },
      ],
      typeValue: 'contact',
      contactValue: this.props.transactContact ? this.props.transactContact : null,
      ownValue: null,
      publicValue: '',
      amountValue: '',
      gasValue: '20',
      chain: null
    };
  },

  componentWillMount() {
    binanceEmitter.removeAllListeners('sendReturned')
    ethEmitter.removeAllListeners('sendReturned')

    binanceEmitter.on('sendReturned', this.sendReturned)
    ethEmitter.on('sendReturned', this.sendReturned)
  },

  renderScreen() {
    let { theme } = this.props
    let {
      loading,
      ethAccounts,
      binanceAccounts,
      ethLoading,
      binanceLoading,
      tokenValue,
      tokenError,
      tokenErrorMessage,
      accountValue,
      accountError,
      accountErrorMessage,
      typeValue,
      typeError,
      typeErrorMessage,
      contactValue,
      contactError,
      contactErrorMessage,
      ownValue,
      ownError,
      ownErrorMessage,
      publicValue,
      publicError,
      publicErrorMessage,
      amountValue,
      amountError,
      amountErrorMessage,
      gasValue,
      gasError,
      gasErrorMessage,
      tokens,
      typeOptions,
      symbol,
      gasSymbol,
      erc20AccountsCombined,
      bep2AccountsCombined,
    } = this.state

    let accountOptions = []

    let aValue = tokenValue
    if(!['Binance',  'Ethereum'].includes(tokenValue)) {
      let erc = erc20AccountsCombined ? erc20AccountsCombined.filter((account) => {
        return account.name === tokenValue
      }) : null
      if(erc.length > 0) {
        aValue='ERC20'
      }

      let bep = bep2AccountsCombined ? bep2AccountsCombined.filter((account) => {
        return account.name === tokenValue
      }) : null
      if(bep.length > 0) {
        aValue = 'BEP2'
      }
    }

    switch (aValue) {
      case 'Binance':
        accountOptions = binanceAccounts ? binanceAccounts.map((account) => {
          return {
            description: account.name,
            value: account.address,
            balance: account.balance,
            symbol: 'BNB'
          }
        }) : []
        break;
      case 'BEP2':
        accountOptions = binanceAccounts ? binanceAccounts.map((account) => {
          let token = account.balances.filter((tokenAccount) => {
            return tokenAccount.symbol === tokenValue
          })[0]

          return {
            description: account.name,
            value: account.address,
            balance: token?parseFloat(token.free):null,
            symbol: token?token.symbol:null
          }
        }) : []
        break;
      case 'Ethereum':
        accountOptions = ethAccounts ? ethAccounts.map((account) => {
          return {
            description: account.name,
            value: account.address,
            balance: account.balance,
            symbol: 'Eth'
          }
        }) : []
        break;
      case 'ERC20':
        accountOptions = ethAccounts ? ethAccounts.map((account) => {
          let token = account.tokens.filter((tokenAccount) => {
            return tokenAccount.name === tokenValue
          })[0]

          return {
            description: account.name,
            value: account.address,
            balance: token.balance,
            symbol: token.symbol
          }
        }) : []
        break;
      default:
    }

    let contactOptions = this.state.contacts ? this.state.contacts.map((contact) => {
      return {
        description: contact.displayName,
        value: contact.userName
      }
    }) : []

    switch (this.state.currentScreen) {
      case "receive":
        return (
          <ReceivePayment
            theme={ theme }
            loading={ ethLoading || binanceLoading }

            tokenOptions={ tokens }
            tokenValue={ tokenValue }

            accountOptions={ accountOptions }
            accountValue={ accountValue }

            publicKey={ accountValue }

            onSelectChange={ this.onSelectChange }

          />
        )
      case "setup":
        return (
          <SetupPayment
            theme={ theme }
            loading={ ethLoading || binanceLoading }

            tokenOptions={ tokens }
            tokenValue={ tokenValue }
            tokenError={ tokenError }
            tokenErrorMessage={ tokenErrorMessage }
            accountOptions={ accountOptions }
            accountValue={ accountValue }
            accountError={ accountError }
            accountErrorMessage={ accountErrorMessage }
            typeOptions={ typeOptions }
            typeValue={ typeValue }
            typeError={ typeError }
            typeErrorMessage={ typeErrorMessage }
            contactOptions={ contactOptions }
            contactValue={ contactValue }
            contactError={ contactError }
            contactErrorMessage={ contactErrorMessage }
            ownOptions={ accountOptions }
            ownValue={ ownValue }
            ownError={ ownError }
            ownErrorMessage={ ownErrorMessage }
            publicValue={ publicValue }
            publicError={ publicError }
            publicErrorMessage={ publicErrorMessage }
            amountValue={ amountValue }
            amountError={ amountError }
            amountErrorMessage={ amountErrorMessage }
            gasValue={ gasValue }
            gasError={ gasError }
            gasErrorMessage={ gasErrorMessage }

            symbol={ symbol }
            gasSymbol={ gasSymbol }

            onSelectChange={ this.onSelectChange }
            onChange={ this.onChange }
          />
        );
      case "confirm":
        return (
          <ConfirmPayment
            loading={ loading }
            tokenValue={ tokenValue }
            amountValue={ amountValue }
            accountOptions={ accountOptions }
            accountValue={ accountValue }
            typeValue={ typeValue }
            contactOptions={ contactOptions }
            contactValue={ contactValue }
            ownOptions={ accountOptions }
            ownValue={ ownValue }
            publicValue={ publicValue }
          />
        );
      case "results":
        return (
          <CompletePayment
            theme={ theme }
            error={ this.state.error }
            transactionID={ this.state.transactionID }
            chain={ this.state.chain }
          />
        );
      default:
        return (
          <SetupPayment
            theme={ theme }
            loading={ ethLoading || binanceLoading }

            tokenOptions={ tokens }
            tokenValue={ tokenValue }
            tokenError={ tokenError }
            tokenErrorMessage={ tokenErrorMessage }
            accountOptions={ accountOptions }
            accountValue={ accountValue }
            accountError={ accountError }
            accountErrorMessage={ accountErrorMessage }
            typeOptions={ typeOptions }
            typeValue={ typeValue }
            typeError={ typeError }
            typeErrorMessage={ typeErrorMessage }
            contactOptions={ contactOptions }
            contactValue={ contactValue }
            contactError={ contactError }
            contactErrorMessage={ contactErrorMessage }
            ownOptions={ accountOptions }
            ownValue={ ownValue }
            ownError={ ownError }
            ownErrorMessage={ ownErrorMessage }
            publicValue={ publicValue }
            publicError={ publicError }
            publicErrorMessage={ publicErrorMessage }
            amountValue={ amountValue }
            amountError={ amountError }
            amountErrorMessage={ amountErrorMessage }
            gasValue={ gasValue }
            gasError={ gasError }
            gasErrorMessage={ gasErrorMessage }

            onSelectChange={ this.onSelectChange }
            onChange={ this.onChange }
          />
        );
    }
  },

  renderStepper() {
    return (
      <Stepper
        orientation="vertical"
        steps={this.state.steps.length}
        activeStep={this.state.activeStep}
        style={{ background: "inherit", padding: "0px" }}
      >
        {this.state.steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel completed={this.state.completed[index]}>
                {label}
              </StepLabel>
              <StepContent>{}</StepContent>
            </Step>
          );
        })}
      </Stepper>
    );
  },

  renderGraphic() {
    return <img alt='Receive' src={require('../assets/images/Receive-Illustration.svg')} width='100%' height='100%' />
  },

  renderLeft() {
    switch(this.state.currentScreen) {
      case "receive":
        return this.renderGraphic()
      case "setup":
      case "confirm":
      case "results":
        return this.renderStepper()
      default:
        break;
    }
  },

  renderTabs() {
    return (
      <Tabs
        value={this.state.tabValue}
        onChange={this.handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Send" />
        <Tab label="Receive" />
      </Tabs>
    )
  },

  renderAction() {
    switch(this.state.currentScreen) {
      case "receive":
        return null
      case "setup":
        return (
          <Button
            variant="contained"
            color="secondary"
            onClick={ this.onContinue }
            size="large"
          >
            Continue
          </Button>
        )
      case "confirm":
        return (
          <div>
            <Button
              variant="outlined"
              color="primary"
              onClick={ this.onBack }
              size="large"
              style={{ marginRight: '20px' }}
              disabled={ this.state.loading }
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={ this.onContinue }
              size="large"
              disabled={ this.state.loading }
            >
              Continue
            </Button>
          </div>
        )
      case "results":
        return (
          <Button
            variant="text"
            color="primary"
            onClick={ this.onContinue }
            size="large"
          >
            Send another payment
          </Button>
        )
      default:
        break;
    }
  },

  render() {
    let { loading } = this.state
    return (
      <Dialog open={this.props.isOpen} onClose={this.props.transactClosed} fullWidth={true} maxWidth={'lg'} TransitionComponent={Transition} >
        {loading?<SectionLoader />:''}
        <Grid container style={{ overflowY: 'hidden' }}>
          <Grid item xs={5} sm={4} md={3}>
            <Grid container directtion='column' justify='space-around' style={{ alignContent: 'center', height: '100%', background:'#2B323C', minHeight: '625px' }}>
              <Grid item>
                { this.renderLeft() }
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={7} sm={8} md={9}>
            <Grid container direction='column' justify='space-between' alignItems="flex-start" style={{ height: '100%' }}>
              <Grid item style={{ width: '100%' }}>
                { this.renderTabs() }
              </Grid>
              <Grid item style={{ width: '100%' }}>
                { this.renderScreen() }
              </Grid>
              <Grid item align="right" style={{ width: '100%', padding: '24px' }}>
                { this.renderAction() }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    );
  },

  handleTabChange(event, tabValue) {
    this.setState({
      tabValue,
      currentScreen: (tabValue===0?"setup":tabValue===1?"receive":"request")
    });

    if(tabValue === 1) {
      let that = this
      window.setTimeout(() => {
        const canvas = document.getElementById("canvas");
        if(canvas) {
          let val = that.state.accountValue

          QRCode.toCanvas(canvas, val, { width: 200 }, function(error) {
            if (error) console.error(error);
          });
        }
      })
    }
  },

  onSelectChange(event, value) {
    switch (event.target.name) {
      case 'token':
        this.setState({ tokenValue: event.target.value, accountValue: null })

        window.setTimeout(() => {
          const canvas = document.getElementById("canvas");
          if(canvas) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        })

        let theToken = this.state.tokens.filter((token) => {
          return token.value === event.target.value
        })

        if(theToken && theToken.length > 0) {
          this.setState({ symbol: theToken[0].symbol, gasSymbol: theToken[0].gasSymbol })
        }

        break;
      case 'account':
        this.setState({ accountValue: event.target.value })
        let that = this

        window.setTimeout(() => {
          const canvas = document.getElementById("canvas");
          let val = that.state.accountValue
          
          QRCode.toCanvas(canvas, val, { width: 200 }, function(error) {
            if (error) console.error(error);
          });
        })

        break;
      case 'type':
        this.setState({ typeValue: event.target.value, contactValue: null, ownValue: null, publicValue: '' })
        break;
      case 'contact':
        this.setState({ contactValue: event.target.value })
        break;
      case 'own':
        this.setState({ ownValue: event.target.value })
        break;
      default:
        break
    }
  },

  onChange(event) {
    switch (event.target.name) {
      case 'public':
        this.setState({ publicValue: event.target.value })
        break;
      case 'amount':
        this.setState({ amountValue: event.target.value })
        break;
      case 'gas':
        this.setState({ gasValue: event.target.value })
        break;
      default:
        break
    }
  },

  onContinue() {
    if(this.state.currentScreen === 'setup') {
      if(this.validateSetup()) {
        this.setState({ currentScreen: 'confirm', activeStep: 1 })
      }
    } else if (this.state.currentScreen === 'confirm') {
      this.callSend()
    } else if (this.state.currentScreen === 'results') {
      this.setState({ currentScreen: 'setup', activeStep: 0, accountValue: null, gasValue: '', ownValue: null, typeValue: 'contact', tokenValue: null, amountValue: '', publicValue: '', contactValue: null })
    }
  },

  onBack() {
    this.setState({ currentScreen: 'setup', activeStep: 0 })
  },

  callSend() {
    let { user, supportedERC20Tokens } = this.props

    let {
      binanceAccounts,
      ethAccounts,
      tokenValue,
      typeValue,
      accountValue,
      amountValue,
      gasValue,
      contactValue,
      publicValue,
      ownValue,
    } = this.state

    let content = {
      fromAddress: accountValue,
      amount: amountValue,
      gwei: gasValue,
    }

    if(typeValue === 'contact') {
      content.contactUserName = contactValue
    }

    if(typeValue === 'own') {
      content.toAddress = ownValue
      content.recipientWalletId = ownValue
    }

    if(typeValue === 'public') {
      content.toAddress = publicValue
      content.recipientAddress = publicValue
    }

    this.setState({ loading: true });

    switch(tokenValue) {
      case 'Binance':
        content.currency = 'BNB'
        binanceDispatcher.dispatch({
          type: 'sendBinance',
          content,
          token: user.token
        });
        this.setState({chain: 'Binance'})
        break
      case 'BEP2':
        binanceDispatcher.dispatch({
          type: 'sendBinance',
          content,
          token: user.token
        });
        this.setState({chain: 'Binance'})
        break
      case 'Ethereum':
        ethDispatcher.dispatch({
          type: 'sendEther',
          content,
          token: user.token
        });
        this.setState({chain: 'Ethereum'})
        break
      case 'ERC20':
        ethDispatcher.dispatch({
          type: 'sendERC20',
          content,
          token: user.token
        });
        this.setState({chain: 'Ethereum'})
        break
      default:

        let acc = ethAccounts.filter((account) => {
          return account.address === accountValue
        })

        if(acc.length > 0) {

          let arr = supportedERC20Tokens.filter((token) => {
            return token.name === tokenValue
          })
          if(arr.length > 0) {
            content.tokenAddress = arr[0].contractAddress
          }

          this.setState({ chain: 'Ethereum'})

          ethDispatcher.dispatch({
            type: 'sendERC20',
            content,
            token: user.token
          });
          return
        }

        let bep = binanceAccounts.filter((account) => {
          return account.address === accountValue
        })

        if(bep.length > 0) {

          content.currency = tokenValue

          this.setState({ chain: 'Binance'})

          binanceDispatcher.dispatch({
            type: 'sendBinance',
            content,
            token: user.token
          });
          return
        }

        break;
    }
  },

  sendReturned(error, data) {
    if (data.success) {
      this.setState({
        loading: false,
        currentScreen: "results",
        activeStep: 2,
        transactionID: data.transactionId,
        error: null
      });
    } else {
      this.setState({
        loading: false,
        currentScreen: "results",
        activeStep: 2,
        error: data.errorMsg,
        transactionID: null
      });
    }
  },

  validateSetup() {

    this.setState({
      tokenError: null,
      tokenErrorMessage: '',
      accountError: null,
      accountErrorMessage: '',
      typeError: null,
      typeErrorMessage: '',
      contactError: null,
      contactErrorMessage: '',
      ownError: null,
      ownErrorMessage: '',
      publicError: null,
      publicErrorMessage: '',
      amountError: null,
      amountErrorMessage: '',
      gasError: null,
      gasErrorMessage: '',
    })

    let {
      tokenValue,
      accountValue,
      typeValue,
      contactValue,
      ownValue,
      amountValue,
      gasValue,
      ethAccounts,
      binanceAccounts,
    } = this.state

    let error = false

    if(!tokenValue) {
      this.setState({ tokenError: true, tokenErrorMessage: 'Token is a required field' })
      error = true
    }

    if(!accountValue) {
      this.setState({ accountError: true, accountErrorMessage: 'Account is a required field' })
      error = true
    }

    if(!typeValue) {
      this.setState({ typeError: true, typeErrorMessage: 'Type is a required field' })
      error = true
    } else {
      if(typeValue === 'contact' && !contactValue) {
        this.setState({ contactError: true, contactErrorMessage: 'Contact is a required field' })
        error = true
      }

      if(typeValue === 'own' && !ownValue) {
        this.setState({ ownError: true, ownErrorMessage: 'Own Account is a required field' })
        error = true
      }

      if(typeValue === 'public' && (!typeValue || typeValue === "")) {
        this.setState({ typeError: true, typeErrorMessage: 'Public Address is a required field' })
        error = true
      }
    }

    if(!amountValue || amountValue === "" || amountValue <= 0) {
      this.setState({ amountError: true, amountErrorMessage: 'Amount is a required field' })
      error = true
    } else {
      if(!this.isNumeric(amountValue)) {
        this.setState({ amountError: true, amountErrorMessage: 'Amount needs to be numeric' })
        error = true
      }
    }


    if(!gasValue || gasValue === "" || gasValue <= 0) {
      this.setState({ gasError: true, gasErrorMessage: 'Gas is a required field' })
      error = true
    } else {
      if(!this.isNumeric(gasValue)) {
        this.setState({ gasError: true, gasErrorMessage: 'Gas needs to be numeric' })
        error = true
      }
    }

    if(tokenValue && accountValue) {
      let accountBalance = 0
      switch(tokenValue) {
        case "Binance":
          accountBalance = binanceAccounts.filter((account) => {
            return account.address === accountValue
          })[0].balance
          break;
        case "Ethereum":
          accountBalance = ethAccounts.filter((account) => {
            return account.address === accountValue
          })[0].balance
          break;
        default:
          let acc = ethAccounts.filter((account) => {
            return account.address === accountValue
          })

          if(acc.length > 0) {
            let tok = acc[0].tokens.filter((token) => {
              return token.name === tokenValue
            })
            accountBalance = tok[0].balance
          } else {
            if(acc.length === 0) {
              acc = binanceAccounts.filter((account) => {
                return account.address === accountValue
              })
            }

            if(acc.length > 0) {

              let tok = acc[0].balances.filter((token) => {
                return token.symbol === tokenValue
              })

              accountBalance = parseFloat(tok[0].free)

              console.log(accountBalance)
            }
          }

          break;
      }

      if(amountValue > accountBalance) {
        this.setState({ amountError: true, amountErrorMessage: 'Amount is greater than Current Balance' })
        error = true
      }
    }

    return !error
  },

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
});

export default Transact;
