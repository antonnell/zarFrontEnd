import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

class Welcome extends Component {
  render() {
    let forgotPasswordClicked = this.props.submitForgotPasswordNavigate;
    let registerClicked = this.props.submitRegisterNavigate;
    if (this.props.loading) {
      forgotPasswordClicked = null;
      registerClicked = null;
    }
    return (
      <Grid
        container
        justify="space-around"
        direction="row"
        spacing={0}
        style={{ marginTop: "100px" }}
      >
        <Grid item xs={10} sm={6} md={4} lg={3}>
          <Grid
            container
            justify="space-around"
            alignItems="center"
            direction="row"
            spacing={0}
          >
            <Grid item xs={12} align="center">
              <Typography variant="h5">Login</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            justify="space-around"
            alignItems="center"
            direction="row"
            spacing={0}
          >
            <Grid item xs={12} style={{ marginTop: "50px" }}>
              <TextField
                required
                autoFocus={true}
                fullWidth={true}
                color="textSecondary"
                error={this.props.usernameError}
                disabled={this.props.loading}
                id="username"
                label="Username / Email"
                value={this.props.username}
                onChange={event => {
                  this.props.handleChange(event, "username");
                }}
                margin="normal"
                onKeyDown={this.props.onLoginKeyDown}
                helperText={this.props.usernameErrorMessage}
              />
              <TextField
                required
                fullWidth={true}
                color="textSecondary"
                type="password"
                error={this.props.passwordError}
                disabled={this.props.loading}
                id="password"
                label="Password"
                value={this.props.password}
                onChange={event => {
                  this.props.handleChange(event, "password");
                }}
                margin="normal"
                onKeyDown={this.props.onLoginKeyDown}
              />
            </Grid>
          </Grid>
          <Grid
            container
            justify="space-around"
            alignItems="center"
            direction="row"
            spacing={0}
          >
            <Grid item xs={12} align="right">
              <Typography
                variant="body1"
                style={{ fontSize: "12px", cursor: "pointer" }}
                onClick={forgotPasswordClicked}
              >
                Forgot Password
              </Typography>
            </Grid>
          </Grid>
          {this.props.loading && (
            <CircularProgress
              size={36}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -12,
                marginLeft: -12
              }}
            />
          )}
          <Grid
            container
            justify="space-around"
            alignItems="center"
            direction="row"
            spacing={0}
            style={{ minHeight: "30px" }}
          >
            <Grid item xs={12} align="center">
              <Typography variant="body1" color="error">
                {this.props.error}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            justify="space-around"
            alignItems="center"
            direction="row"
            spacing={0}
            style={{ marginTop: "40px" }}
          >
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={this.props.submitLogin}
                disabled={this.props.loading}
              >
                LOGIN
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            justify="space-around"
            alignItems="center"
            direction="row"
            spacing={0}
            style={{ marginTop: "40px" }}
          >
            <Grid item xs={12} align="center">
              <Typography
                variant="body1"
                style={{
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-block"
                }}
                onClick={registerClicked}
              >
                No account yet? Click here to register!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Welcome;
