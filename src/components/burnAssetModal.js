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

class BurnModal extends Component {

  render() {

    let {
      handleClose,
      handleChange,
      handleBurn,
      handleSelectChange,

      isOpen,
      error,
      loading,

      assetValue,
      assetOptions,
      assetError,
      assetErrorMessage,

      burnAmountValue,
      burnAmountError,
      burnAmountErrorMessage,

      burningAddressValue,
      burningAddressOptions,
      burningAddressError,
      burningAddressErrorMessage,

      recipientAddressValue,
      recipientAddressOptions,
      recipientAddressError,
      recipientAddressErrorMessage,

    } = this.props

    console.log(assetValue)

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
                  Burn Asset
                </Typography>
              </Grid>
              <Grid item xs={11}>
                { this.renderSelect("Asset", assetValue, assetOptions, assetError, assetErrorMessage, handleSelectChange, loading, 'asset') }
              </Grid>
              <Grid item xs={11}>
                { this.renderSelect("Burning Address", burningAddressValue, burningAddressOptions, burningAddressError, burningAddressErrorMessage, handleSelectChange, loading, 'burningAddress') }
              </Grid>
              <Grid item xs={11}>
                { this.renderImput("Burn From Address", recipientAddressValue, recipientAddressError, recipientAddressErrorMessage, handleChange, loading, 'recipientAddress') }
              </Grid>
              <Grid item xs={11}>
                { this.renderImput("Burn amount", burnAmountValue, burnAmountError, burnAmountErrorMessage, handleChange, loading, 'burnAmount') }
              </Grid>
              <Grid item xs={11}>
                <Typography style={{color: '#f44336'}} >
                  {error}
                </Typography>
              </Grid>
              <Grid item xs={11} align='right'>
                <Button disabled={loading} variant='contained' size='small' onClick={ handleBurn } color="primary" autoFocus>
                  Burn Asset
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

export default (BurnModal);
