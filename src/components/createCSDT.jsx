import React, { Component } from 'react';
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  ListItemText,
  Input
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PageTitle from "./pageTitle";
import PageLoader from './pageLoader';

class CreateCSDT extends Component {

  render() {
    const {
      theme,
    } = this.props

    return (
      <Grid container justify="center" alignItems="flex-start" direction="row" style={{ height: '100%' }}>
        <Grid item xs={12} align="left" style={{ height: '100%' }}>
          <Grid container justify="flex-start" alignItems="flex-start" direction="row" style={{ height: '100%' }}>
            <Grid item xs={12} lg={9} style={{ marginTop: '60px', paddingRight: '24px' }}>
              <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>Collateralize & Generate CSDT</Typography>
              { this.renderCSDTCreation() }
            </Grid>
            <Grid item xs={12} lg={3} style={{ paddingLeft: '24px', backgroundColor: '#CCC', height: (window.innerWidth < 1280 ? 'auto' : '100%'), paddingTop: '60px', paddingRight: '24px' }}>
              <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>Price Info</Typography>
              { this.renderPricing() }
              <Typography variant='h2' align='left' style={{ lineHeight: '37px', marginTop: '60px' }}>Account Info</Typography>
              { this.renderAccount() }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  renderCSDTCreation() {
    const {
      loading,
      error,

      collateral,
      collateralError,
      collateralDenom,
      collateralDenomError,
      generated,
      generatedError,
      minCollateral,
      minimumCollateralizationRatio,
      currentPrice,
      liquidationPrice,
      liquidationPriceWarning,
      liquidationPriceError,
      collateralizationRatio,
      collateralizationRatioWarning,
      collateralizationRatioError,
      maxGenerated,
      maxGeneratedWarning,
      maxGeneratedError,

      csdtPrices,

      onCreateClick,
      handleChange,
      onBlur
    } = this.props

    const classes = {
      infoContainer: {
        marginTop: '48px',
        borderTop: '1px solid #ccc',
        borderBottom: '1px solid #ccc',
      },
      infoContainerLeft: {
        borderRight: '1px solid #ccc',
        padding: '28px 0px'
      },
      infoContainerRight: {
        padding: '28px 0px'
      },
      pricePair: {
        marginTop: '12px'
      },
      button: {
        marginTop: '48px'
      }
    }

    let warningStyle = {}
    let errorStyle = {}

    if(liquidationPriceWarning || collateralizationRatioWarning || maxGeneratedWarning) {
      warningStyle = {
        color: 'orange'
      }
    }
    if(liquidationPriceError || collateralizationRatioError || maxGeneratedError) {
      errorStyle = {
        color: '#f44336'
      }
    }


    return (
      <Grid container justify="flex-start" alignItems="flex-start" direction="row" style={{ marginTop: '24px', minHeight: '100%' }}>
        <Grid item xs={6}>
          <Typography variant="body1">How much { collateralDenom.toUpperCase() } would you like to collateralize?</Typography>
          <TextField
            style={classes.textField}
            margin="normal"
            variant="outlined"
            color="primary"
            onChange={ handleChange }
            onBlur={ onBlur }
            value={ collateral }
            id="collateral"
            error={ collateralError }
            disalbed={ loading }
            InputProps={{
              endAdornment: <InputAdornment position="end">{ this.renderAssetSelect() }</InputAdornment>,
            }}
            helperText={ collateralError ? collateralError : ("Min. "+collateralDenom.toUpperCase()+" required: "+minCollateral+" "+collateralDenom.toUpperCase())}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">How much UCSDT would you like to generate?</Typography>
          <TextField
            style={classes.textField}
            margin="normal"
            variant="outlined"
            color="primary"
            onChange={ handleChange }
            onBlur={ onBlur }
            value={ generated }
            id="generated"
            error={ generatedError }
            disalbed={ loading }
            InputProps={{
              endAdornment: <InputAdornment position="end">ucsdt</InputAdornment>,
            }}
            helperText={"Max UCSDT available to generate: "+maxGenerated+" UCSDT"}
          />
        </Grid>
        <Grid
          item
          xs={12}
          style={ classes.infoContainer }>
          <Grid container justify="flex-start" alignItems="flex-start">
            <Grid item xs={6} style={ classes.infoContainerLeft }>
              <Grid container justify="flex-start" alignItems="flex-start">
                <Grid item xs={7} style={ classes.pricePair }>
                  <Typography variant={ 'body1' }>Liquidation price ({collateralDenom.toUpperCase()}/UUSD)</Typography>
                </Grid>
                <Grid item xs={4} style={ {...classes.pricePair, ...warningStyle, ...errorStyle } } align={ 'right' }>
                  <Typography variant={ 'h3' }>{liquidationPrice} UUSD</Typography>
                </Grid>
                <Grid item xs={7} style={ classes.pricePair }>
                  <Typography variant={ 'body1' } style={ classes.smaller }>Current price information ({collateralDenom.toUpperCase()}/UUSD)</Typography>
                </Grid>
                <Grid item xs={4} style={ classes.pricePair } align={ 'right' }>
                  <Typography variant={ 'h3' } style={ classes.smaller }>{currentPrice.toFixed(2)} UUSD</Typography>
                </Grid>
                <Grid item xs={7} style={ classes.pricePair }>
                  <Typography variant={ 'body1' } style={ classes.smaller }>Liquidation penalty</Typography>
                </Grid>
                <Grid item xs={4} style={ classes.pricePair } align={ 'right' }>
                  <Typography variant={ 'h3' } style={ classes.smaller }>13.000%</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} style={ classes.infoContainerRight }>
              <Grid container justify="flex-end" alignItems="flex-start">
                <Grid item xs={7} style={ classes.pricePair }>
                  <Typography variant={ 'body1' }>Collateralization ratio</Typography>
                </Grid>
                <Grid item xs={4} style={ {...classes.pricePair, ...warningStyle, ...errorStyle } } align={ 'right' }>
                  <Typography variant={ 'h3' }>{ collateralizationRatio+'%'}</Typography>
                </Grid>
                <Grid item xs={7} style={ classes.pricePair }>
                  <Typography variant={ 'body1' } style={ classes.smaller }>Minimum ratio</Typography>
                </Grid>
                <Grid item xs={4} style={ classes.pricePair } align={ 'right' }>
                  <Typography variant={ 'h3' } style={ classes.smaller }>{minimumCollateralizationRatio+'%'}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} align="right">
          <Button
            style={ classes.button }
            variant="contained"
            color="secondary"
            onClick={ onCreateClick }
            size="large"
            disalbed={ loading }
          >
            Collateralize
          </Button>
        </Grid>
        <Grid item xs={12} align="right">
          <Typography variant="subtitle1" style={{ color: "#f44336", marginTop: '12px' }}>
            {this.props.error}
          </Typography>
        </Grid>
        { loading && this.renderLoader() }
      </Grid>
    )
  }

  renderAssetSelect() {

    const {
      collateralDenom,
      handleSelectChange,
      loading,
      csdtPrices
    } = this.props

    return (
      <FormControl fullWidth={true} >
        <Select
        name={'collateralDenom'}
        value={ collateralDenom }
        onChange={ handleSelectChange }
        disabled={ loading }
        variant={ 'outlined' }
        renderValue={ value => {
            let selected = null
            let val = ''
            selected = csdtPrices && csdtPrices.length > 0 && csdtPrices.filter((option) => {
              return option.asset_code === collateralDenom
            })[0]
            if(selected) {
              val = selected.asset_code
            }

            return (
              <Typography variant="body1" noWrap>{ val }</Typography>
            );
          }}
        >
          { csdtPrices
            ? csdtPrices.map(option => {
                return (
                  <MenuItem key={option.asset_code} value={option.asset_code}>
                    <ListItemText primary={option.asset_code} />
                  </MenuItem>
                );
              })
            : ""}
        </Select>
      </FormControl>
    )
  }

  renderLoader() {
    return <PageLoader />
  }

  renderPricing() {
    const {
      csdtPrices
    } = this.props

    if(!csdtPrices) {
      return null
    }

    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center">
        { this.renderPricesHeader() }
        { this.renderPrices(csdtPrices) }
      </Grid>
    )
  }

  renderPricesHeader() {
    const classes = {
      tableHeader: {
        padding: '12px 0px'
      }
    }

    return (
      <React.Fragment>
        <Grid item xs={7} style={ classes.tableHeader }>
          <Typography variant={ "h2" }>ASSET</Typography>
        </Grid>
        <Grid item xs={5} style={ classes.tableHeader } align="right">
          <Typography variant={ "h2" }>Price</Typography>
        </Grid>
      </React.Fragment>
    )
  }

  renderPrices(prices) {
    return prices.map((price) => {
      return this.renderPrice(price)
    })
  }

  renderPrice(price) {
    const classes = {
      pricePair: {
        paddingBottom: '12px',
        paddingTop: '12px'
      },
      pricePrice: {
        paddingBottom: '12px',
        paddingRight: '6px'
      },
    }

    return (
      <React.Fragment>
        <Grid item xs={6} style={ classes.pricePair }>
          <Typography variant={ 'body1' }>{ (price.asset_code ? price.asset_code.toUpperCase() : 'Unknown') + " / UUSD" }</Typography>
        </Grid>
        <Grid item xs={6} style={ classes.pricePrice } align={ 'right' }>
          <Typography variant={ 'h3' } style={{ display: 'inline-block' }}>{ parseFloat(price.price ? price.price : 0).toFixed(2) }</Typography>
          <Typography variant={ 'body1' } style={{ display: 'inline-block', width: '50px' }}>{ "UUSD" }</Typography>
        </Grid>
      </React.Fragment>
    )
  }

  renderAccount() {
    const {
      accounts
    } = this.props

    if(!accounts) {
      return <div>No account</div>
    }

    const primaryAccount = accounts.filter((account) => {
      return account.account_type === 'XAR'
    })[0]

    if(!primaryAccount) {
      return <div>No account found</div>
    }

    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center">
        { this.renderAssetsHeader() }
        { this.renderAssets(primaryAccount) }
      </Grid>
    )
  }

  renderAssetsHeader() {
    const classes = {
      tableHeader: {
        padding: '12px 0px'
      }
    }

    return (
      <React.Fragment>
        <Grid item xs={7} style={ classes.tableHeader }>
          <Typography variant={ "h2" }>ASSET</Typography>
        </Grid>
        <Grid item xs={5} style={ classes.tableHeader } align="right">
          <Typography variant={ "h2" }>BALANCE</Typography>
        </Grid>
      </React.Fragment>
    )
  }

  renderAssets(primaryAccount) {

    const classes = {
      tableBody1: {
        padding: '24px'
      }
    }

    const assets = primaryAccount.balances

    if(!assets || assets.length === 0) {
      return <Grid item xs={12} style={ classes['tableBody1'] }>
        <Typography variant={ 'h3' }>There are no assets in this wallet</Typography>
      </Grid>
    }

    let index = 0
    return assets.map((asset) => {
      index++
      return this.renderAsset(asset, index)
    })
  }

  renderAsset(asset, index) {

    const classes = {
      pricePair: {
        paddingBottom: '12px',
        paddingTop: '12px'
      },
      pricePrice: {
        paddingBottom: '12px',
        paddingRight: '6px'
      },
    }

    return (
      <React.Fragment>
        <Grid item xs={5} style={ classes.pricePair }>
          <Typography variant={ 'body1' }>{ asset.denom }</Typography>
        </Grid>
        <Grid item xs={7} style={ classes.pricePrice } align={ 'right' }>
          <Typography variant={ 'h3' } style={{ display: 'inline-block' }}>{ parseFloat(asset.amount).toFixed(0) }</Typography>
          <Typography variant={ 'body1' } style={{ display: 'inline-block', width: '50px' }}>{ asset.denom }</Typography>
        </Grid>
      </React.Fragment>
    )
  }
}

export default (CreateCSDT);
