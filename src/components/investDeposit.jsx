import React, { Component } from "react";
import {
  Grid,
  Typography,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Input,
  InputAdornment
} from "@material-ui/core";

class InvestDeposit extends Component {

  render() {

    let {
      accountValue,
      accountOptions,
      accountError,
      accountErrorMessage,

      amountValue,
      amountError,
      amountErrorMessage,

      currentBalance,

      onSelectChange,
      onChange,

      disabled,
    } = this.props

    let walletBalance = 0

    let account = accountOptions ? accountOptions.filter((account) => {
      return account.value === accountValue
    }) : null
    if(account && account.length > 0) {
      let balances = account[0].balances ? account[0].balances.filter((bal) => {
        return bal.denom === 'uzar'
      }) : null

      if(balances && balances.length > 0) {
        walletBalance = balances[0].amount
      }
    }

    return (
      <Grid container justify="space-around" alignItems="flex-start" direction="row" style={{ width: '100%' }} >
        <Grid item xs={10} md={11} align="left" style={{ marginTop: '24px' }}>
          <Typography>Get interest on your ZAR just for storing it in a savings account.</Typography>
        </Grid>
        <Grid item xs={10} md={5} align="left">
          <div style={{ marginTop: '60px' }}>
            { this.renderSelect("Select Your Account", accountValue, accountOptions, accountError, accountErrorMessage, onSelectChange, disabled, 'account') }
          </div>
          <div style={{ marginTop: '60px' }}>
            { this.renderInput("Deposit Amount", amountValue, amountError, amountErrorMessage, onChange, disabled, 'amountValue', 'ZAR') }
          </div>
        </Grid>
        <Grid item xs={10} md={5} align="left">
          <Typography variant='body1' style={{ fontSize: '11px', marginTop: '60px' }}>
            Current Wallet Balance
          </Typography>
          <Typography variant="h5" noWrap style={{ fontSize:  '20px', marginTop: '4px' }}>
            { walletBalance.toFixed(4) } ZAR
          </Typography>
          <Typography variant='body1' style={{ fontSize: '11px', marginTop: '12px' }}>
            Current Investment Balance
          </Typography>
          <Typography variant="h5" noWrap style={{ fontSize:  '20px', marginTop: '4px' }}>
            { currentBalance.toFixed(4) } ZAR
          </Typography>
          <Typography variant='body1' style={{ fontSize: '11px', marginTop: '12px' }}>
            New Investment Balance
          </Typography>
          <Typography variant="h5" noWrap style={{ fontSize:  '20px', marginTop: '4px' }}>
            { (parseFloat(currentBalance) + parseFloat(!amountValue?0:amountValue)).toFixed(4) } ZAR
          </Typography>
          <Typography variant='body1' style={{ fontSize: '11px', marginTop: '12px' }}>
            Estimated Monthly Interest
          </Typography>
          <Typography variant="h5" noWrap style={{ fontSize:  '20px', marginTop: '4px' }}>
            ~{ ((parseFloat(currentBalance) + parseFloat(!amountValue?0:amountValue))*0.04).toFixed(4) } ZAR
          </Typography>
        </Grid>
      </Grid>
    );
  }

  renderSelect(label, value, options, error, errorMessage, onChange, disabled, name, ignoreValue) {
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
            val = selected.description + (selected.balance ? (' ('+selected.balance.toFixed(4)+' '+selected.symbol+')') : '')
          }

          return (
            <Typography variant="body1" noWrap>{ val }</Typography>
          );
        }}
      >
        {options
          ? options.filter((option) => {
              return option.value !== ignoreValue
            }).map(option => {
              return (
                <MenuItem key={option.value} value={option.value}>
                  <ListItemText primary={option.description + (option.balance ? (' ('+option.balance.toFixed(4)+' '+option.symbol+')') : '')} />
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

  renderInput(label, value, error, errorMessage, onChange, disabled, name, inputAdornment) {
    return (<FormControl error={error} fullWidth={true} >
      <Typography variant="body1" style={{
          fontSize: '12px',
          fontFamily: "Montserrat-SemiBold"
        }}>
        {label}
      </Typography>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        endAdornment={<InputAdornment position="end">{inputAdornment ? inputAdornment : ''}</InputAdornment>}
      />
      {error === true ? (
        <FormHelperText>{errorMessage}</FormHelperText>
      ) : null}
    </FormControl>)
  }
}

export default InvestDeposit;
