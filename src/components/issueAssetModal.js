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
  Input,
  Checkbox
} from '@material-ui/core';
import SectionLoader from './sectionLoader';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class IssueModal extends Component {

  render() {

    let {
      handleClose,
      handleChange,
      handleIssue,
      handleSelectChange,
      handleCheckboxChange,

      isOpen,
      error,
      loading,

      assetNameValue,
      assetNameError,
      assetNameErrorMessage,

      symbolValue,
      symbolError,
      symbolErrorMessage,

      totalSupplyValue,
      totalSupplyError,
      totalSupplyErrorMessage,

      mintableValue,
      mintableError,
      mintableErrorMessage,

      mintingAddressValue,
      mintingAddressOptions,
      mintingAddressError,
      mintingAddressErrorMessage,

      ownerBurnableValue,
      ownerBurnableError,
      ownerBurnableErrorMessage,

      holderBurnableValue,
      holderBurnableError,
      holderBurnableErrorMessage,

      fromBurnableValue,
      fromBurnableError,
      fromBurnableErrorMessage,

      freezableValue,
      freezableError,
      freezableErrorMessage,

    } = this.props

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
                  Asset Details
                </Typography>
              </Grid>
              <Grid item xs={11}>
                { this.renderImput("Asset Name", assetNameValue, assetNameError, assetNameErrorMessage, handleChange, loading, 'assetName') }
              </Grid>
              <Grid item xs={11}>
                { this.renderImput("Symbol", symbolValue, symbolError, symbolErrorMessage, handleChange, loading, 'symbol') }
              </Grid>
              <Grid item xs={11}>
                { this.renderImput("Total Supply", totalSupplyValue, totalSupplyError, totalSupplyErrorMessage, handleChange, loading, 'totalSupply') }
              </Grid>
              <Grid item xs={11}>
                { this.renderSelect("Minting Address", mintingAddressValue, mintingAddressOptions, mintingAddressError, mintingAddressErrorMessage, handleSelectChange, loading, 'mintingAddress') }
              </Grid>
              <Grid item xs={11}>
                <Typography variant="h3" style={{
                    marginTop: '24px',
                    marginBottom: '24px'
                  }}>
                  Asset Configuration
                </Typography>
              </Grid>
              <Grid item xs={11}>
                { this.renderCheckbox("Mintable", mintableValue, mintableError, mintableErrorMessage, handleCheckboxChange, loading, 'mintable') }
              </Grid>
              <Grid item xs={3}>
                { this.renderCheckbox("Owner Burnable", ownerBurnableValue, ownerBurnableError, ownerBurnableErrorMessage, handleCheckboxChange, loading, 'ownerBurnable') }
              </Grid>
              <Grid item xs={3}>
                { this.renderCheckbox("Holder Burnable", holderBurnableValue, holderBurnableError, holderBurnableErrorMessage, handleCheckboxChange, loading, 'holderBurnable') }
              </Grid>
              <Grid item xs={5}>
                { this.renderCheckbox("From Burnable", fromBurnableValue, fromBurnableError, fromBurnableErrorMessage, handleCheckboxChange, loading, 'fromBurnable') }
              </Grid>
              <Grid item xs={11}>
                { this.renderCheckbox("Freezable", freezableValue, freezableError, freezableErrorMessage, handleCheckboxChange, loading, 'freezable') }
              </Grid>
              <Grid item xs={11}>
                <Typography style={{color: '#f44336'}} >
                  {error}
                </Typography>
              </Grid>
              <Grid item xs={11} align='right'>
                <Button disabled={loading} variant='contained' size='small' onClick={ handleIssue } color="primary" autoFocus>
                  Issue Asset
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

  renderCheckbox(label, value, error, errorMessage, onChange, disabled, name) {
    return (
      <FormControl variant="outlined" fullWidth={false} error={error} style={{ marginBottom: '12px' }}>
        <Typography variant="body1" style={{
            fontSize: '12px',
            fontFamily: "Montserrat-SemiBold",
            display: 'inline-block'
          }}>
          { label }
        </Typography>
        <Checkbox
          style={{ justifyContent: 'flex-start' }}
          name={ name }
          id={ name }
          checked={ value }
          onChange={ onChange }
          value={ name }
          disabled={ disabled }
        />
        {error === true ? (
          <FormHelperText>{errorMessage}</FormHelperText>
        ) : null}
      </FormControl>
    )
  }
}

export default (IssueModal);
