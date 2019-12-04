import React from "react";
import createReactClass from "create-react-class";
import LoginComponent from "../components/login";
import {
  LOGIN,
  LOGIN_RETURNED,
} from '../constants'


const sha256 = require('sha256');
const { emitter, dispatcher } = require("../store/xarStore.js");

let Login = createReactClass({
  getInitialState() {
    return {
      loading: false,
      error: null,

      emailAddress: "",
      emailAddressError: false,
      emailAddressErrorMessage: false,
      password: "",
      passwordError: false,
      passwordErrorMessage: false
    };
  },

  UNSAFE_componentWillMount() {
    emitter.on(LOGIN_RETURNED, this.loginReturned);
  },

  componentWillUnmount() {
    emitter.removeListener(LOGIN_RETURNED, this.loginReturned)
  },

  render() {
    return (
      <LoginComponent
        handleChange={this.handleChange}
        submitForgotPasswordNavigate={this.submitForgotPasswordNavigate}
        submitLogin={this.submitLogin}
        onLoginKeyDown={this.onLoginKeyDown}
        emailAddress={this.state.emailAddress}
        emailAddressError={this.state.emailAddressError}
        emailAddressErrorMessage={this.state.emailAddressErrorMessage}
        password={this.state.password}
        passwordError={this.state.passwordError}
        passwordErrorMessage={this.state.passwordError}
        error={this.state.error}
        loading={this.state.loading}
        theme={this.props.theme}
      />
    );
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

  submitLogin() {

    const {
      emailAddress,
      password
    } = this.state


    this.setState({
      emailAddressError: false,
      passwordError: false,
    });
    let error = false;

    if (emailAddress === "") {
      this.setState({ emailAddressError: true });
      error = true;
    }
    //add email validation

    if (password === "") {
      this.setState({ passwordError: true });
      error = true;
    }

    if (!error) {
      this.setState({ loading: true, error: null });
      this.props.setError(null)

      this.props.startLoading()
      var content = {
        email_address: emailAddress,
        password: password
      };
      dispatcher.dispatch({ type: LOGIN, content });
    }
  },

  loginReturned(error, data) {
    const {
      stopLoading,
      setError,
      setUser
    } = this.props

    this.setState({ loading: false });
    stopLoading()

    if (error) {
      setError(error.toString())
      return this.setState({ error: error.toString() });
    }

    if (data.success) {
      let user = data.result
      user.token = data.result.jwt.token;
      user.tokenKey = sha256(data.result.email_address);
      setUser(user);

      window.location.hash = "accounts";
    } else if (data.result) {
      this.setState({ error: data.result.toString() });
      setError(data.result.toString())
    } else {
      this.setState({ error: data.statusText });
      setError(data.statusText)
    }
  },

  submitForgotPasswordNavigate() {
    this.props.navigate("forgotPassword");
  }
});


export default Login;
