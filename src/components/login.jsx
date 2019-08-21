import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class Login extends Component {
  render() {
    let {
      submitForgotPasswordNavigate,
      loading,
      emailAddress,
      emailAddressError,
      emailAddressErrorMessage,
      handleChange,
      onLoginKeyDown,
      password,
      passwordError,
      submitLogin,
      theme
    } = this.props

    let forgotPasswordClicked = submitForgotPasswordNavigate;
    if (loading) {
      forgotPasswordClicked = null;
    }

    if(!theme) {
      return null
    }

    return (
      <Grid
        container
        justify="space-around"
        direction="row"
        style={
          {
            marginTop: '50vh',
            transform: 'translate(0%,-50%)'
          }
        }
      >
        <Grid item xs={8} md={6} align='left'>
          <Typography variant="h5">Login</Typography>
          <TextField
            required
            autoFocus={true}
            fullWidth={true}
            color="textSecondary"
            error={emailAddressError}
            disabled={loading}
            id="emailAddress"
            label="Email Address"
            value={emailAddress}
            onChange={event => {
              handleChange(event, "emailAddress");
            }}
            margin="normal"
            onKeyDown={onLoginKeyDown}
            helperText={emailAddressErrorMessage}
          />
          <TextField
            required
            fullWidth={true}
            color="textSecondary"
            type="password"
            error={passwordError}
            disabled={loading}
            id="password"
            label="Password"
            value={password}
            onChange={event => {
              handleChange(event, "password");
            }}
            margin="normal"
            onKeyDown={onLoginKeyDown}
          />
          <Typography
            variant="body1"
            style={theme.custom.forgotPassword}
            onClick={forgotPasswordClicked}
          >
            Forgot Password?
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={submitLogin}
            disabled={loading}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Login;
