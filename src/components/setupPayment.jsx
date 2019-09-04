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

class SetupPayment extends Component {

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

      typeValue,
      typeOptions,
      typeError,
      typeErrorMessage,

      beneficiaryValue,
      beneficiaryOptions,
      beneficiaryError,
      beneficiaryErrorMessage,

      ownValue,
      ownOptions,
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

      onSelectChange,
      onChange,

      disabled,
    } = this.props

    return (
      <Grid container justify="space-around" alignItems="center" direction="row" style={{ width: '100%' }} >
        <Grid item xs={10} md={5} align="left" style={{ marginTop: '60px' }}>
          { this.renderSelect("Select Your Asset", assetValue, assetOptions, assetError, assetErrorMessage, onSelectChange, disabled, 'asset') }
        </Grid>
        <Grid item xs={10} md={5} align="left" style={{ marginTop: '60px' }}>
          { this.renderSelect("Select Your Account", accountValue, accountOptions, accountError, accountErrorMessage, onSelectChange, disabled, 'account') }
        </Grid>

        <Grid item xs={10} md={5} align="left" style={{ marginTop: '60px' }} >
          { this.renderSelect("Recipient Type", typeValue, typeOptions, typeError, typeErrorMessage, onSelectChange, disabled, 'type') }
        </Grid>
        <Grid item xs={10} md={5} align="left" style={{ marginTop: '60px' }} >
          { typeValue === 'beneficiary' && this.renderSelect("Select Beneficiary", beneficiaryValue, beneficiaryOptions, beneficiaryError, beneficiaryErrorMessage, onSelectChange, disabled, 'beneficiary') }
          { typeValue === 'own' && this.renderSelect("Select Your Account", ownValue, ownOptions, ownError, ownErrorMessage, onSelectChange, disabled, 'own', accountValue) }
          { typeValue === 'public' && this.renderInput("Enter Address", publicValue, publicError, publicErrorMessage, onChange, disabled, 'publicValue') }
        </Grid>
        <Grid item xs={10} md={5} align="left" style={{ marginTop: '60px' }} >
          { this.renderInput("Payment Amount", amountValue, amountError, amountErrorMessage, onChange, disabled, 'amountValue') }
        </Grid>
        <Grid item xs={10} md={5} align="left" style={{ marginTop: '60px' }} >
          { this.renderInput("Reference", referenceValue, referenceError, referenceErrorMessage, onChange, disabled, 'referenceValue') }
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

export default SetupPayment;
