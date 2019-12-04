import React, { Component } from "react";
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  ListItemText
} from "@material-ui/core";

class ReceivePayment extends Component {

  render() {

    let {
      accountValue,
      accountOptions,
      accountError,
      accountErrorMessage,

      assetValue,
      assetOptions,
      assetError,
      assetErrorMessage,

      publicKey,

      onSelectChange,
      disabled
    } = this.props

    return (
      <Grid container justify="space-around" alignItems="flex-start" direction="row" style={{ marginTop: '48px', minHeight: '400px' }} >
        <Grid item xs={11} md={11} align="left">
          { this.renderSelect("Select Your Account", accountValue, accountOptions, accountError, accountErrorMessage, onSelectChange, disabled, 'account') }
        </Grid>
        {publicKey &&
          <Grid item xs={11} md={5} align="left">
            <Typography variant="body1">
              QR Code
            </Typography>
            <canvas id='canvas' style={ { minHeight: '200px', width: '200px' } }/>
          </Grid>
        }
        {publicKey &&
          <Grid item xs={11} md={5} align="left">
            <Typography variant="body1">
              Wallet Address
            </Typography>
            <Typography variant="body1">
              {publicKey}
            </Typography>
          </Grid>
        }
      </Grid>
    );
  }

  renderSelect(label, value, options, error, errorMessage, onChange, disabled, name) {

    return (<FormControl error={error} fullWidth={true} >
      <Typography variant="body1" style={{
          fontSize: '12px',
          fontFamily: "Montserrat-SemiBold"
        }}>
        {label}
      </Typography>
      <Select name={name} value={value} onChange={onChange} disabled={disabled} renderValue={value => {
          let selected = null
          let val = ''
          selected = options && options.length > 0 && options.filter((option) => {
            return option.value === value
          })[0]
          if(selected) {
            val = selected.description
          }

          return (
            <Typography variant="body1" noWrap>{ val }</Typography>
          );
        }}
      >
        {options
          ? options.map(option => {
              return (
                <MenuItem key={option.value} value={option.value}>
                  <ListItemText primary={option.description} />
                </MenuItem>
              );
            })
          : ""}
      </Select>
      {error === true ? (
        <FormHelperText>{errorMessage}</FormHelperText>
      ) : null}
    </FormControl>)
  }
}

export default ReceivePayment;
