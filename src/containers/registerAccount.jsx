import React from 'react';
import RegisterAccountComponent from '../components/registerAccount';
import {
  REGISTER,
  REGISTER_RETURNED,
  ERROR
} from '../constants'

const createReactClass = require('create-react-class');
const { emitter, dispatcher, store } = require("../store/zarStore.js");
const email = require('email-validator');

let RegisterAccount = createReactClass({
  getInitialState() {
    return {
      loading: false,
      error: null,
      mobileNumber: '',
      mobileNumberError: false,
      mobileNumberErrorMessage: "",
      emailAddress: '',
      emailAddressError: false,
      emailAddressErrorMessage: "",
      password: '',
      passwordError: false,
      passwordErrorMessage: "",
      confirmPassword: '',
      confirmPasswordError: false,
      confirmPasswordErrorMessage: '',
      firstname: '',
      firstnameError: false,
      firstnameErrorMessage: '',
      lastname: '',
      lastnameError: false,
      lastnameErrorMessage: '',
    };
  },

  componentWillMount() {
    emitter.on(REGISTER_RETURNED, this.registerReturned);
  },

  componentWillUnmount() {
    emitter.removeListener(REGISTER_RETURNED, this.registerReturned);
  },

  render() {
    return (
      <RegisterAccountComponent
        handleChange={ this.handleChange }
        submitRegister={ this.submitRegister }
        submitLoginNavigate={ this.submitLoginNavigate }
        onRegisterKeyDown={ this.onRegisterKeyDown }
        emailAddress={ this.state.emailAddress }
        emailAddressError={ this.state.emailAddressError }
        emailAddressErrorMessage={ this.state.emailAddressErrorMessage }
        mobileNumber={ this.state.mobileNumber }
        mobileNumberError={ this.state.mobileNumberError }
        mobileNumberErrorMessage={ this.state.mobileNumberErrorMessage }
        password={ this.state.password }
        passwordError={ this.state.passwordError }
        passwordErrorMessage={ this.state.passwordErrorMessage }
        confirmPassword={ this.state.confirmPassword }
        confirmPasswordError={ this.state.confirmPasswordError }
        confirmPasswordErrorMessage={ this.state.confirmPasswordErrorMessage }
        error={ this.state.error }
        loading={ this.state.loading }
        handleChecked={ this.handleChecked }
        resendConfirmationEmail={ this.resendConfirmationEmail }
        theme={ this.props.theme }
      />
    );
  },

  resendConfirmationEmail() {
    this.props.navigate('resendConfirmationEmail');;
  },

  handleChange(event, name) {
    if (event != null && event.target != null) {
      this.setState({
        [name]: event.target.value
      });
    }
  },

  onLoginKeyDown(event) {
    if (event.which === 13) {
      this.submitLogin();
    }
  },

  submitRegister() {
    var error = false;
    this.setState({
      mobileNumberError: false,
      mobileNumberErrorMessage: "",
      emailAddressError: false,
      emailAddressErrorMessage: "",
      passwordError: false,
      passwordErrorMessage: "",
      confirmPasswordError: false,
      confirmPasswordErrorMessage: '',
    });

    if (this.state.firstname === '') {
      this.setState({
        firstnameError: true,
        firstnameErrorMessage: 'Firstname is a required field'
      });
      error = true;
    }
    if (this.state.lastname === '') {
      this.setState({
        lastnameError: true,
        lastnameErrorMessage: 'Lastname is a required field'
      });
      error = true;
    }

    if (this.state.mobileNumber === '') {
      this.setState({
        mobileNumberError: true,
        mobileNumberErrorMessage: 'Mobile Number is a required field'
      });
      error = true;
    }
    if (this.state.emailAddress === '') {
      this.setState({
        emailAddressError: true,
        emailAddressErrorMessage: 'Email address is a required field'
      });
      error = true;
    } else if (!email.validate(this.state.emailAddress)) {
      this.setState({
        emailAddressError: true,
        emailAddressErrorMessage:
          'Email address provided is not a valid email address'
      });
      error = true;
    }
    if (this.state.password === '') {
      this.setState({
        passwordError: true,
        passwordErrorMessage: 'Your password is a required field'
      });
      error = true;
    } else if (this.state.password.length < 8) {
      this.setState({
        passwordError: true,
        passwordErrorMessage: 'Passwords must be at least 8 characters long'
      });
      error = true;
    }
    if (this.state.confirmPassword === '') {
      this.setState({
        confirmPasswordError: true,
        confirmPasswordErrorMessage: 'Please confirm your password'
      });
      error = true;
    }
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        confirmPasswordError: true,
        confirmPasswordErrorMessage: 'Your passwords to do not match'
      });
      error = true;
    }

    if (!error) {
      this.setState({ loading: true });
      this.props.setError(null)
      this.props.startLoading()

      const {
        mobileNumber,
        emailAddress,
        password,
        firstname,
        lastname
      } = this.state

      var content = {
        mobile_number: mobileNumber,
        email_address: emailAddress,
        password: password,
        firstname: firstname,
        lastname: lastname
      };

      dispatcher.dispatch({ type: REGISTER, content });
    }
  },

  registerReturned(error, data) {

    this.setState({ loading: false });
    this.props.stopLoading()

    if (error) {
      this.props.setError(error.toString())
      return this.setState({ error: error.toString() });
    }

    if (data.success) {
      this.props.setEmail(this.state.emailAddress)
      this.props.navigate("registrationSuccessful")
    } else if (data.result) {
      this.setState({ error: data.result });
      this.props.setError(data.result)
    } else {
      this.setState({ error: data.statusText });
      this.props.setError(data.statusText)
    }
  },

  submitLoginNavigate() {
    this.props.navigate("login")
  },

  onRegisterKeyDown(event) {
    if (event.which === 13) {
      this.submitRegister();
    }
  }
});

export default RegisterAccount;
