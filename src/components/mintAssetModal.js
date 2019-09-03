import React, { Component } from "react";
import {
  Dialog,
  Button,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  ListItemText,
  FormHelperText,
  Slide,
  Input
} from '@material-ui/core';
import SectionLoader from './sectionLoader';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class MintModal extends Component {

  render() {

    let {
      handleClose,
      handleChange,
      handleMint,
      handleSelectChange,

      isOpen,
      error,
      loading,

      assetValue,
      assetOptions,
      assetError,
      assetErrorMessage,

      mintAmountValue,
      mintAmountError,
      mintAmountErrorMessage,

      mintingAddressValue,
      mintingAddressOptions,
      mintingAddressError,
      mintingAddressErrorMessage,

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

    } = this.props

    console.log(assetOptions)

    return (
      <Dialog open={isOpen} onClose={handleClose} fullWidth={true} maxWidth={'md'} TransitionComponent={Transition}>
        {loading?<SectionLoader />:''}

        <Grid container style={{ overflowY: 'hidden' }}>
          <Grid item xs={3}>
            <Grid container directtion='column' justify='space-around' style={{ alignContent: 'center', height: '100%', background:'#2B323C', minHeight: '525px' }}>
              <Grid item>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={9} style={{ marginBottom: '24px' }} >
            <Grid container direction='row' justify='center' alignItems="flex-start" style={{ height: '100%' }}>
              <Grid item xs={11}>
                <Typography variant="h3" style={{
                    marginTop: '24px',
                    marginBottom: '24px'
                  }}>
                  Mint Asset
                </Typography>
              </Grid>
              <Grid item xs={11}>
                { this.renderSelect("Asset", assetValue, assetOptions, assetError, assetErrorMessage, handleSelectChange, loading, 'asset') }
              </Grid>
              <Grid item xs={11}>
                { this.renderSelect("Minting Address", mintingAddressValue, mintingAddressOptions, mintingAddressError, mintingAddressErrorMessage, handleSelectChange, loading, 'mintingAddress') }
              </Grid>
              <Grid item xs={11}>
                { this.renderSelect("Recipient Type", typeValue, typeOptions, typeError, typeErrorMessage, handleSelectChange, loading, 'type') }
              </Grid>
              <Grid item xs={11}>
                { typeValue === 'beneficiary' && this.renderSelect("Select Beneficiary", beneficiaryValue, beneficiaryOptions, beneficiaryError, beneficiaryErrorMessage, handleSelectChange, loading, 'beneficiary') }
                { typeValue === 'own' && this.renderSelect("Select Your Account", ownValue, ownOptions, ownError, ownErrorMessage, handleSelectChange, loading, 'own') }
                { typeValue === 'public' && this.renderImput("Enter Address", publicValue, publicError, publicErrorMessage, handleChange, loading, 'public') }
              </Grid>
              <Grid item xs={11}>
                { this.renderImput("Mint amount", mintAmountValue, mintAmountError, mintAmountErrorMessage, handleChange, loading, 'mintAmount') }
              </Grid>
              <Grid item xs={11}>
                <Typography style={{color: '#f44336'}} >
                  {error}
                </Typography>
              </Grid>
              <Grid item xs={11} align='right'>
                <Button disabled={loading} variant='contained' size='small' onClick={ handleMint } color="primary" autoFocus>
                  Mint Asset
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    );
  };

  renderImput(label, value, error, errorMessage, onChange, disabled, name) {
    return (<FormControl error={error} fullWidth={true} style={{ marginBottom: '12px' }} >
      <Typography variant="body1" style={{
          fontSize: '12px',
          fontFamily: "Montserrat-SemiBold"
        }}>
        {label}
      </Typography>
      <Input name={name} value={value} onChange={onChange} disabled={disabled} />
      {error === true ? (
        <FormHelperText>{errorMessage}</FormHelperText>
      ) : null}
    </FormControl>)
  }

  renderSelect(label, value, options, error, errorMessage, onChange, disabled, name) {
    return (<FormControl error={error} fullWidth={true} style={{ marginBottom: '12px' }}>
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

export default (MintModal);
