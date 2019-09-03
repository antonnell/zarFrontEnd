import React, { Component } from 'react';
import PageTitle from './pageTitle';
import {
  Button,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  ListItemText,
  FormHelperText,
  Input,
  InputAdornment,
  Paper,
} from '@material-ui/core';
import PageLoader from './pageLoader';
import Snackbar from './snackbar';

class TokenSwap extends Component {
  render() {
    const {
      // error,
      // message,
      // loading,
      theme
    } = this.props

    return (
      <Grid container justify="flex-start" alignItems="flex-start" direction="row">
        <Grid
          item
          xs={12}
          align="left"
        >
          <PageTitle theme={theme} root={null} screen={{display: 'Token Swap', location: 'tokenSwap'}} />
        </Grid>
        <Grid item xs={12} align='left'>
          <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>Token Swap</Typography>
        </Grid>
        <Grid item xs={12} align="center" style={{ minHeight: "190px", paddingTop: "100px" }} >
          <Typography variant="h2">
            This is where the token swap would be, if we had any!
          </Typography>
        </Grid>
      </Grid>
    );

    // return (
    //   <Grid container justify="flex-start" alignItems="flex-start" direction="row">
    //     <Grid
    //       item
    //       xs={12}
    //       align="left"
    //     >
    //       <PageTitle theme={theme} root={null} screen={{display: 'Token Swap', location: 'tokenSwap'}} />
    //     </Grid>
    //     <Grid item xs={12} align='left'>
    //       <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>Token Swap</Typography>
    //     </Grid>
    //     { this.renderSwap() }
    //     { message && this.renderSnackBar('Information', message) }
    //     { loading && this.renderLoader() }
    //     { error && this.renderSnackBar('Error', error) }
    //   </Grid>
    // );
  }

  renderSwap() {
    const {
      loading,
      ethAccountValue,
      ethAccountOptions,
      ethAccountError,
      ethAccountErrorMessage,
      sendValue,
      sendError,
      sendErrorMessage,
      receiveValue,
      receiveError,
      receiveErrorMessage,
      handleSelectChange,
      handleChange,
      swapTokens,
      sendToken,
      receiveToken,
      tokenOptions,
      bnbAccountValue,
      bnbAccountError,
      bnbAccountErrorMessage,
      bnbAccountOptions
    } = this.props

    return (<Grid item xs={12} xl={9} align='left' style={{paddingTop: '35px'}}>
      <Paper style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px'
        }}>
        <Grid
          container
          justify="space-around"
          direction="row"
        >
          <Grid item xs={ 6 } align='left'
            style={{
              padding: '50px 30px'
            }}>
            {this.renderToken(sendToken, tokenOptions, handleSelectChange, loading, 'sendToken')}
            <Typography>
              You are swapping
            </Typography>
            { this.renderInput(sendValue, sendError, sendErrorMessage, handleChange, loading, 'send', 'CURV') }
            <Typography style={{ marginTop: '24px'}}>
              From your account
            </Typography>
            {
              (() => {
                switch (sendToken) {
                  case 'Ethereum':
                    return this.renderSelect("", ethAccountValue, ethAccountOptions, ethAccountError, ethAccountErrorMessage, handleSelectChange, loading, 'ethAccount')
                  case 'Binance':
                    return this.renderSelect("", bnbAccountValue, bnbAccountOptions, bnbAccountError, bnbAccountErrorMessage, handleSelectChange, loading, 'bnbAccount')
                  default:
                }
              })()
            }
          </Grid>
          <Grid item xs={ 6 } align='left'
            style={{
              padding: '50px 30px'
            }}>
            {this.renderToken(receiveToken, tokenOptions, handleSelectChange, loading, 'receiveToken')}
            <Typography>
              You get
            </Typography>
            { this.renderInput(receiveValue, receiveError, receiveErrorMessage, handleChange, true, 'receive', 'CURV') }
            <Typography style={{ marginTop: '24px'}}>
              In your account
            </Typography>
            {
              (() => {
                switch (receiveToken) {
                  case 'Ethereum':
                    return this.renderSelect("", ethAccountValue, ethAccountOptions, ethAccountError, ethAccountErrorMessage, handleSelectChange, loading, 'ethAccount')
                  case 'Binance':
                    return this.renderSelect("", bnbAccountValue, bnbAccountOptions, bnbAccountError, bnbAccountErrorMessage, handleSelectChange, loading, 'bnbAccount')
                  default:
                }
              })()
            }
          </Grid>
        </Grid>
        <Button disabled={loading} variant='contained' size='small' onClick={swapTokens} color="primary" autoFocus style={{ borderRadius: '1px 1px 20px 20px', width: '100%' }}>
          Swap
        </Button>
      </Paper>
    </Grid>)
  }

  renderToken(value, options, onChange, disabled, name) {

    const rootStyle = {
      marginBottom: '24px'
    }
    const iconStyle = {
      display: 'inline-block',
      verticalAlign: 'middle',
      borderRadius: '25px',
      background: '#dedede',
      marginRight: '24px',
      height: '50px',
      width: '50px',
      textAlign: 'center'
    }
    const nameStyle = {
      verticalAlign: 'middle',
      fontSize: '30px'
    }
    const selectNameStyle = {
      verticalAlign: 'middle',
      fontSize: '30px',
      color: '#ffffff'
    }

    return (
      <div style={rootStyle}>
        <FormControl fullWidth={true} style={{marginTop: '12px', maxWidth: '400px'}} >
          <Select name={name} value={value} onChange={onChange} disabled={disabled} renderValue={value => {

              let selected = null
              let val = ''
              let icon = ''
              selected = options && options.length > 0 && options.filter((option) => {
                return option.value === value
              })[0]
              if(selected) {
                val = selected.description
                icon = selected.icon
              }

              return (
                <React.Fragment>
                  <div style={iconStyle}>
                    <img
                      alt=""
                      src={ require('../assets/images/'+icon+'-logo.png') }
                      height="50px"
                    />
                  </div>
                  <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                    <Typography  variant='h5' style={nameStyle}>{val}</Typography>
                  </div>
                </React.Fragment>
              );
            }}
          >
            {options
              ? options.map(option => {
                  return (
                    <MenuItem key={option.value+'_'+option.description} value={option.value}>
                      <React.Fragment>
                        <div style={iconStyle}>
                          <img
                            alt=""
                            src={ require('../assets/images/'+option.icon+'-logo.png') }
                            height="50px"
                          />
                        </div>
                        <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                          <Typography  variant='h5' style={selectNameStyle}>{option.description}</Typography>
                        </div>
                      </React.Fragment>
                    </MenuItem>
                  );
                })
              : ""}
          </Select>
        </FormControl>
      </div>
    )
  }

  renderSnackBar(type, message) {
    return <Snackbar open={true} type={type} message={message} />
  }

  renderLoader() {
    return <PageLoader />
  }

  renderSelect(label, value, options, error, errorMessage, onChange, disabled, name) {
    return (<FormControl error={error} fullWidth={true} style={{marginTop: '12px', maxWidth: '400px'}} >
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
                <MenuItem key={option.value+'_'+option.description} value={option.value}>
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

  renderImput(label, value, error, errorMessage, onChange, disabled, name, inputAdornment) {
    return (<FormControl error={error} fullWidth={true} style={{marginTop: '12px', maxWidth: '400px'}} >
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
        endAdornment={<InputAdornment position="end">{inputAdornment ? inputAdornment : ''}</InputAdornment>}/>
      {error === true ? (
        <FormHelperText>{errorMessage}</FormHelperText>
      ) : null}
    </FormControl>)
  }

  renderInput(value, error, errorMessage, onChange, disabled, name, inputAdornment) {
    console.log(error)
    console.log(errorMessage)
    return (<FormControl error={error} fullWidth={true} style={{marginTop: '12px', maxWidth: '400px'}} >
      <Input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        endAdornment={<InputAdornment position="end">{inputAdornment ? inputAdornment : ''}</InputAdornment>}
        style={{ fontSize: '30px' }}
      />
      {error === true ? (
        <FormHelperText>{errorMessage}</FormHelperText>
      ) : null}
    </FormControl>)
  }
}

export default (TokenSwap);
