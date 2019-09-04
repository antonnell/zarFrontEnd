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
import {
  PAY,
  PAY_RETURNED,
  GET_ACCOUNTS,
  GET_ACCOUNTS_RETURNED,
  GET_BENEFICIARIES,
  GET_BENEFICIARIES_RETURNED,
  GET_ASSETS,
  GET_ASSETS_RETURNED,
} from '../constants'

const createReactClass = require("create-react-class");
const QRCode = require("qrcode");

const { emitter, dispatcher, store } = require("../store/zarStore.js");

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

let Transact = createReactClass({
  getInitialState() {

    const accounts = store.getStore('accounts')
    let accountValue = this.props.transactAccount ? this.props.transactAccount : null

    if(!this.props.transactAccount) {
      accountValue = accounts.length > 0 ? accounts[0].uuid : null
    }

    const beneficiaries = store.getStore('beneficiaries')
    let selectedBeneficiary = null

    if(this.props.transactBeneficiary && beneficiaries) {
      selectedBeneficiary = beneficiaries.filter((bene) => {
        return bene.uuid === this.props.transactBeneficiary
      })
    }

    let assetValue = 'ftm'
    if(this.props.transactAsset) {
      assetValue = this.props.transactAsset.denom
    }

    return {
      accounts: accounts,
      allAssets: store.getStore('allAssets'),
      assets: store.getStore('allAssets').map((asset) => {
        return {
          description: asset.name,
          value: asset.issue_id
        }
      }),
      beneficiaries: beneficiaries,

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
      assetValue: assetValue,
      typeOptions: [
        {  value: 'beneficiary', description: 'Beneficiary' },
        {  value: 'public', description: 'Public Address' },
        {  value: 'own', description: 'Own Account' },
      ],
      typeValue: 'beneficiary',
      beneficiaryValue: this.props.transactBeneficiary ? this.props.transactBeneficiary : null,
      referenceValue: selectedBeneficiary && selectedBeneficiary.length > 0 ? selectedBeneficiary[0].reference : null,
      ownValue: null,
      publicValue: '',
      amountValue: '',
    };
  },

  UNSAFE_componentWillMount() {

    const accounts = store.getStore('accounts')
    if(!accounts || accounts.length === 0) {
      emitter.removeListener(GET_ACCOUNTS_RETURNED, this.getAccountsReturned)
      emitter.on(GET_ACCOUNTS_RETURNED, this.getAccountsReturned)
      dispatcher.dispatch({ type: GET_ACCOUNTS, content: {} })
    }

    const beneficiaries = store.getStore('beneficiaries')
    if(!beneficiaries || beneficiaries.length === 0) {
      emitter.removeListener(GET_BENEFICIARIES_RETURNED, this.getBeneficiariesReturned)
      emitter.on(GET_BENEFICIARIES_RETURNED, this.getBeneficiariesReturned)
      dispatcher.dispatch({ type: GET_BENEFICIARIES, content: {} })
    }

    const allAssets = store.getStore('allAssets')
    if(!allAssets || allAssets.length === 0) {
      emitter.removeListener(GET_ASSETS_RETURNED, this.assetsUpdated)
      emitter.on(GET_ASSETS_RETURNED, this.assetsUpdated)
      dispatcher.dispatch({ type: GET_ASSETS, content: {} });
    }

    emitter.removeListener(PAY_RETURNED, this.payReturned)
    emitter.on(PAY_RETURNED, this.payReturned)
  },

  componentWillUnmount() {
    emitter.removeListener(PAY_RETURNED, this.payReturned)
    emitter.removeListener(GET_ACCOUNTS_RETURNED, this.getAccountsReturned)
    emitter.removeListener(GET_BENEFICIARIES_RETURNED, this.getBeneficiariesReturned)
    emitter.removeListener(GET_ASSETS_RETURNED, this.assetsUpdated)
  },

  getBeneficiariesReturned(error, data) {
    this.setState({
      beneficiaries: store.getStore('beneficiaries'),
    })
  },

  assetsUpdated(error, data) {
    this.setState({
      allAssets: store.getStore('allAssets'),
      assets: store.getStore('allAssets').map((asset) => {
        return {
          description: asset.name,
          value: asset.issue_id
        }
      })
    })
  },

  getAccountsReturned(error, data) {
    this.setState({
      accounts: store.getStore('accounts')
    })
  },

  renderScreen() {
    let { theme } = this.props
    let {
      loading,
      accounts,
      assets,
      assetValue,
      assetError,
      assetErrorMessage,
      accountValue,
      accountError,
      accountErrorMessage,
      typeOptions,
      typeValue,
      typeError,
      typeErrorMessage,
      beneficiaryValue,
      beneficiaryError,
      beneficiaryErrorMessage,
      ownValue,
      ownError,
      ownErrorMessage,
      publicValue,
      publicError,
      publicErrorMessage,
      amountValue,
      amountError,
      amountErrorMessage,
      referenceValue,
      referenceError,
      referenceErrorMessage,
      beneficiaries
    } = this.state

    let accountOptions = accounts ? accounts.map((account) => {
      return {
        description: account.name,
        value: account.uuid,
        balance: account.balance,
        symbol: 'ZAR'
      }
    }) : []

    let publicKey = accounts ? accounts.filter((account) => {
      return account.uuid === accountValue
    }) : null
    if(publicKey && publicKey.length > 0) {
      publicKey = publicKey[0].address
    }

    let beneficiaryOptions = beneficiaries ? beneficiaries.map((beneficiary) => {
      return {
        description: beneficiary.name,
        value: beneficiary.uuid
      }
    }) : []

    switch (this.state.currentScreen) {
      case "receive":
        return (
          <ReceivePayment
            theme={ theme }
            loading={ loading }

            assetOptions={ assets }
            assetValue={ assetValue }

            accountOptions={ accountOptions }
            accountValue={ accountValue }

            publicKey={ publicKey }

            onSelectChange={ this.onSelectChange }
          />
        )
      case "setup":
        return (
          <SetupPayment
            theme={ theme }
            loading={ loading }

            assetOptions={ assets }
            assetValue={ assetValue }
            assetError={ assetError }
            assetErrorMessage={ assetErrorMessage }
            accountOptions={ accountOptions }
            accountValue={ accountValue }
            accountError={ accountError }
            accountErrorMessage={ accountErrorMessage }
            typeOptions={ typeOptions }
            typeValue={ typeValue }
            typeError={ typeError }
            typeErrorMessage={ typeErrorMessage }
            beneficiaryOptions={ beneficiaryOptions }
            beneficiaryValue={ beneficiaryValue }
            beneficiaryError={ beneficiaryError }
            beneficiaryErrorMessage={ beneficiaryErrorMessage }
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
            referenceValue={ referenceValue }
            referenceError={ referenceError }
            referenceErrorMessage={ referenceErrorMessage }

            onSelectChange={ this.onSelectChange }
            onChange={ this.onChange }
          />
        );
      case "confirm":
        return (
          <ConfirmPayment
            loading={ loading }
            assets={ assets }
            assetValue={ assetValue }
            amountValue={ amountValue }
            accountOptions={ accountOptions }
            accountValue={ accountValue }
            typeValue={ typeValue }
            beneficiaryOptions={ beneficiaryOptions }
            beneficiaryValue={ beneficiaryValue }
            ownOptions={ accountOptions }
            ownValue={ ownValue }
            publicValue={ publicValue }
            referenceValue={ referenceValue }
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
            loading={ loading }

            assetOptions={ assets }
            assetValue={ assetValue }
            assetError={ assetError }
            assetErrorMessage={ assetErrorMessage }
            accountOptions={ accountOptions }
            accountValue={ accountValue }
            accountError={ accountError }
            accountErrorMessage={ accountErrorMessage }
            typeOptions={ typeOptions }
            typeValue={ typeValue }
            typeError={ typeError }
            typeErrorMessage={ typeErrorMessage }
            beneficiaryOptions={ beneficiaryOptions }
            beneficiaryValue={ beneficiaryValue }
            beneficiaryError={ beneficiaryError }
            beneficiaryErrorMessage={ beneficiaryErrorMessage }
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
            referenceValue={ referenceValue }
            referenceError={ referenceError }
            referenceErrorMessage={ referenceErrorMessage }

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
        break;
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
      case 'asset':
        this.setState({ assetValue: event.target.value })

        window.setTimeout(() => {
          const canvas = document.getElementById("canvas");
          if(canvas) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        })

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
        this.setState({ typeValue: event.target.value, beneficiaryValue: null, ownValue: null, publicValue: '' })
        break;
      case 'beneficiary':

        const selectedBeneficiary = this.state.beneficiaries.filter((bene) => {
          return bene.uuid === event.target.value
        })

        let ref = this.state.referenceValue
        if(selectedBeneficiary.length > 0) {
          ref = selectedBeneficiary[0].reference
        }

        this.setState({ beneficiaryValue: event.target.value, referenceValue: ref })
        break;
      case 'own':
        this.setState({ ownValue: event.target.value })
        break;
      default:
        break
    }
  },

  onChange(event) {
    if(event != null && event.target != null) {
      this.setState({
        [event.target.name]: event.target.value
      });
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
      this.setState({ currentScreen: 'setup', activeStep: 0, typeValue: 'beneficiary', amountValue: '', ownValue: null, publicValue: '', beneficiaryValue: null, referenceValue: '' })
    }
  },

  onBack() {
    this.setState({ currentScreen: 'setup', activeStep: 0 })
  },

  callSend() {
    let {
      assetValue,
      typeValue,
      accountValue,
      amountValue,
      beneficiaryValue,
      publicValue,
      ownValue,
      referenceValue
    } = this.state

    let content = {
      account_uuid: accountValue,
      amount: amountValue,
      reference: referenceValue,
      asset_id: assetValue
    }

    if(typeValue === 'beneficiary') {
      content.beneficiary_uuid = beneficiaryValue
    }

    if(typeValue === 'own') {
      content.to_address = ownValue
    }

    if(typeValue === 'public') {
      content.to_address = publicValue
    }

    this.setState({ loading: true });

    dispatcher.dispatch({ type: PAY, content });
  },

  payReturned(error, data) {
    if(error) {
      this.setState({
        loading: false,
        currentScreen: "results",
        activeStep: 2,
        error: error.toString()
      });

      return
    }

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
        error: data.result,
        transactionID: null
      });
    }
  },

  validateSetup() {

    this.setState({
      assetError: null,
      assetErrorMessage: '',
      accountError: null,
      accountErrorMessage: '',
      typeError: null,
      typeErrorMessage: '',
      beneficiaryError: null,
      beneficiaryErrorMessage: '',
      ownError: null,
      ownErrorMessage: '',
      publicError: null,
      publicErrorMessage: '',
      amountError: null,
      amountErrorMessage: '',
    })

    let {
      assetValue,
      accountValue,
      typeValue,
      beneficiaryValue,
      ownValue,
      amountValue,
    } = this.state

    let error = false

    if(!assetValue) {
      this.setState({ assetError: true, assetErrorMessage: 'Asset is a required field' })
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
      if(typeValue === 'beneficiary' && !beneficiaryValue) {
        this.setState({ beneficiaryError: true, beneficiaryErrorMessage: 'Beneficiary is a required field' })
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

    return !error
  },

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
});

export default Transact;
