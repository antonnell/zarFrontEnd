import React from 'react'
import BeneficiariesComponent from '../components/beneficiaries'
import {
  CREATE_BENEFICIARY,
  CREATE_BENEFICIARY_RETURNED,
  GET_BENEFICIARIES,
  GET_BENEFICIARIES_RETURNED,
  ERROR,
} from '../constants'

const createReactClass = require('create-react-class')
const { emitter, dispatcher, store } = require("../store/xarStore.js");

let Beneficiaries = createReactClass({
  getInitialState() {
    return {
      loading: false,
      error: null,
      name: "",
      nameError: false,
      nameErrorMessage: "",
      emailAddress: "",
      emailAddressError: false,
      emailAddressErrorMessage: "",
      mobileNumber: "",
      mobileNumberError: false,
      mobileNumberErrorMessage: "",
      reference: "",
      referenceError: false,
      referenceErrorMessage: "",
      walletAddress: "",
      walletAddressError: false,
      walletAddressErrorMessage: "",
      createOpen: false
    }
  },

  UNSAFE_componentWillMount() {
    emitter.removeListener(GET_BENEFICIARIES_RETURNED, this.getBeneficiariesReturned);
    emitter.removeListener(CREATE_BENEFICIARY_RETURNED, this.createBeneficiaryReturned);
    emitter.removeListener(ERROR, this.showError);

    emitter.on(GET_BENEFICIARIES_RETURNED, this.getBeneficiariesReturned);
    emitter.on(CREATE_BENEFICIARY_RETURNED, this.createBeneficiaryReturned);
    emitter.on(ERROR, this.showError)

    var content = {};
    dispatcher.dispatch({ type: GET_BENEFICIARIES, content });
  },

  componentWillUnmount() {
    emitter.removeListener(GET_BENEFICIARIES_RETURNED, this.getBeneficiariesReturned);
    emitter.removeListener(CREATE_BENEFICIARY_RETURNED, this.createBeneficiaryReturned);
    emitter.removeListener(ERROR, this.showError);
  },

  showError(error) {
    this.setState({ error: error.toString() })
  },

  resetInputs() {
    this.setState({
      error: null,
      name: "",
      nameError: false,
      nameErrorMessage: "",
      emailAddress: "",
      emailAddressError: false,
      emailAddressErrorMessage: "",
      mobileNumber: "",
      mobileNumberError: false,
      mobileNumberErrorMessage: "",
      reference: "",
      referenceError: false,
      referenceErrorMessage: "",
      walletAddress: "",
      walletAddressError: false,
      walletAddressErrorMessage: "",
    })
  },

  getBeneficiariesReturned(error, data) {
    this.setState({
      beneficiaries: store.getStore('beneficiaries'),
      createOpen: false,
      loading: false,
    })

    this.resetInputs();
  },

  createBeneficiaryReturned(error, data) {
    if(!data && error) {
      this.setState({ loading: false })
      this.showError(error)
      return
    }

    if(!data.success) {
      this.setState({ loading: false })
      this.showError(data.result)
      return
    }
  },

  render() {

    const {
      theme,
      transactClicked,
      size
    } = this.props

    const {
      beneficiaries,
      name,
      nameError,
      nameErrorMessage,
      emailAddress,
      emailAddressError,
      emailAddressErrorMessage,
      mobileNumber,
      mobileNumberError,
      mobileNumberErrorMessage,
      reference,
      referenceError,
      referenceErrorMessage,
      walletAddress,
      walletAddressError,
      walletAddressErrorMessage,
      loading,
      error,
      createOpen
    } = this.state


    return (
      <BeneficiariesComponent
        theme={theme}
        transactClicked={transactClicked}
        size={size}

        handleChange={this.handleChange}
        onCreateKeyDown={this.onCreateKeyDown}
        createClicked={this.createClicked}
        updateNavigateClicked={this.updateNavigateClicked}
        validateField={this.validateField}
        handleCreateOpen={this.handleCreateOpen}
        handleCreateClose={this.handleCreateClose}

        beneficiaries={beneficiaries}
        name={name}
        nameError={nameError}
        nameErrorMessage={nameErrorMessage}
        emailAddress={emailAddress}
        emailAddressError={emailAddressError}
        emailAddressErrorMessage={emailAddressErrorMessage}
        mobileNumber={mobileNumber}
        mobileNumberError={mobileNumberError}
        mobileNumberErrorMessage={mobileNumberErrorMessage}
        reference={reference}
        referenceError={referenceError}
        referenceErrorMessage={referenceErrorMessage}
        walletAddress={walletAddress}
        walletAddressError={walletAddressError}
        walletAddressErrorMessage={walletAddressErrorMessage}
        loading={loading}
        error={error}
        createOpen={createOpen}
      />
    )
  },

  handleCreateOpen() {
    this.setState({createOpen: true});
  },
  handleCreateClose() {
    this.setState({createOpen: false})
  },

  onCreateKeyDown(event) {
    if (event.which === 13) {
      this.createClicked()
    }
  },

  createClicked() {
    if(this.validateName() & this.validateEmailAddress() & this.validateMobileNumber() & this.validateReference() & this.validateWalletAddress()) {
      this.setState({ loading: true, error: null });

      const {
        name,
        emailAddress,
        mobileNumber,
        reference,
        walletAddress,
      } = this.state

      var content = {
        name: name,
        email_address: emailAddress,
        mobile_number: mobileNumber,
        reference: reference,
        wallet_address: walletAddress
      };
      dispatcher.dispatch({ type: CREATE_BENEFICIARY, content });
    }
  },

  handleChange (event, name) {
    if(event != null && event.target != null) {
      this.setState({
        [name]: event.target.value
      });
    }
  },

  validateField (event, name) {
    if (name==="emailAddress") {
      this.validateEmailAddress(event.target.value)
    } else if (name==="name") {
      this.validateName(event.target.value)
    } else if (name==="mobileNumber") {
      this.validateMobileNumber(event.target.value)
    } else if (name==="reference`") {
      this.validateReference(event.target.value)
    } else if (name==="walletAddress`") {
      this.validateWalletAddress(event.target.value)
    }
  },

  validateName(value) {
    this.setState({ nameValid: false, nameError: false, nameErrorMessage:'' });
    if(value==null) {
      value = this.state.name;
    }
    if(value === '') {
      this.setState({ nameError: true, nameErrorMessage:'name is required' });
      return false;
    }
    this.setState({ nameValid: true });
    return true;
  },

  validateEmailAddress(value) {
    this.setState({ emailAddressValid: false, emailAddressError: false, emailAddressErrorMessage:'' });
    if(value==null) {
      value = this.state.emailAddress;
    }
    if(value === '') {
      this.setState({ emailAddressError: true, emailAddressErrorMessage:'Email address is required' });
      return false;
    }
    this.setState({ emailAddressValid: true });
    return true;
  },

  validateMobileNumber(value) {
    this.setState({ mobileNumberValid: false, mobileNumberError: false, mobileNumberErrorMessage:'' });
    if(value==null) {
      value = this.state.mobileNumber;
    }
    if(value === '') {
      this.setState({ mobileNumberError: true, mobileNumberErrorMessage:'Mobile number is required' });
      return false;
    }
    this.setState({ mobileNumberValid: true });
    return true;
  },

  validateReference(value) {
    this.setState({ referenceValid: false, referenceError: false, referenceErrorMessage:'' });
    if(value==null) {
      value = this.state.reference;
    }
    if(value === '') {
      this.setState({ referenceError: true, referenceErrorMessage:'Reference is required' });
      return false;
    }
    this.setState({ referenceValid: true });
    return true;
  },

  validateWalletAddress(value) {
    this.setState({ walletAddressValid: false, walletAddressError: false, walletAddressErrorMessage:'' });
    if(value==null) {
      value = this.state.walletAddress;
    }
    if(value === '') {
      this.setState({ walletAddressError: true, walletAddressErrorMessage:'Wallet Address is required' });
      return false;
    }
    this.setState({ walletAddressValid: true });
    return true;
  },

})

export default (Beneficiaries);
