import React from 'react';
import RegisterAccountComponent from '../components/registerAccount';
import {
  REGISTER,
  REGISTER_RETURNED,
  CREATE_ACCOUNT,
  CREATE_ACCOUNT_RETURNED,
} from '../constants'

const createReactClass = require('create-react-class');
const { emitter, dispatcher } = require("../store/xarStore.js");
const email = require('email-validator');
const sha256 = require('sha256');

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

  UNSAFE_componentWillMount() {
    emitter.on(REGISTER_RETURNED, this.registerReturned);
    emitter.on(CREATE_ACCOUNT_RETURNED, this.createAccountReturned);
  },

  componentWillUnmount() {
    emitter.removeListener(REGISTER_RETURNED, this.registerReturned);
    emitter.removeListener(CREATE_ACCOUNT_RETURNED, this.createAccountReturned);
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

      let user = data.result
      user.token = data.result.jwt.token;
      user.tokenKey = sha256(data.result.email_address);
      this.props.setUser(user);

      var content = {
        account_type: 'XAR',
        name: 'My XAR Account'
      };

      dispatcher.dispatch({ type: CREATE_ACCOUNT, content });
    } else if (data.result) {
      this.setState({ error: data.result });
      this.props.setError(data.result)
    } else {
      this.setState({ error: data.statusText });
      this.props.setError(data.statusText)
    }
  },

  createAccountReturned(error, data) {
    //I think we can basically ignore this.
    //Once the store is updated from the GET_ACCOUNTS, the UI will populate.
    if (error) {
      this.props.setError(error.toString())
      return this.setState({ error: error.toString() });
    }

    if (data.success) {
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
