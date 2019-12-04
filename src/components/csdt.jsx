import React, { Component } from 'react';
import {
  Grid,
  Typography,
  Button,
  Slide,
  Paper,
  FormControl,
  Select,
  MenuItem,
  ListItemText,
  SvgIcon,
} from '@material-ui/core';
import {
  withStyles, createMuiTheme, MuiThemeProvider
} from '@material-ui/core/styles';


import { Doughnut } from 'react-chartjs-2';

import PageTitle from "./pageTitle";
import PageLoader from './pageLoader';

import DepositCSDT from './depositCSDT'
import GenerateCSDT from './generateCSDT'
import PaybackCSDT from './paybackCSDT'
import WithdrawCSDT from './withdrawCSDT'
import CloseCSDT from './closeCSDT'

import { colors } from '../theme'

function RefreshIcon(props) {
  return (
    <SvgIcon onClick={props.onClick} style={props.style}>
      <path
        fill={ colors.lightBlack }
        d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
      />
    </SvgIcon>
  );
}

class CSDT extends Component {

  render() {

    const {
      theme,
      actionModalOpen,
      loading
    } = this.props

    return (
      <Grid container justify="center" alignItems="flex-start" direction="row" style={{ height: '100%' }}>
        <Grid item xs={12} align="left" style={{ height: '100%' }}>
          <Grid container justify="flex-start" alignItems="flex-start" direction="row" style={{ height: '100%' }}>
            <Grid item xs={12} lg={9} style={{ marginTop: '60px', paddingRight: '24px' }}>
              { this.renderCSDTInfo() }
            </Grid>
            <Grid item xs={12} lg={3} style={{ paddingLeft: '24px', backgroundColor: '#CCC', height: (window.innerWidth < 1280 ? 'auto' : '100%'), paddingTop: '60px', paddingRight: '24px' }}>
              <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>Price Info</Typography>
              { this.renderPricing() }
              <Typography variant='h2' align='left' style={{ lineHeight: '37px', marginTop: '60px' }}>Account Info</Typography>
              { this.renderAccount() }
            </Grid>
          </Grid>
        </Grid>
        { actionModalOpen && this.renderActionModal() }
        { loading && this.renderLoader() }
      </Grid>
    );
  }

  renderLoader() {
    return <PageLoader />
  }

  renderActionModal() {
    const classes = {
      actionPane: {
        position: 'absolute',
        right: '0px',
        top: '0px',
        bottom: '0px',
        width: '480px',
        backgroundColor: 'rgb(33, 44, 65)'
      }
    }

    const {
      action,
      toggleActionModal,
      collateralDenom,
      handleSelectChange,
      loading,
      csdtPrices,
      accounts,
      currentPrice,
      projectedLiquidationPrice,
      projectedCollateralizationRatio,
      depositCollateral,
      depositCollateralError,
      withdrawCollateral,
      withdrawCollateralError,
      paybackGenerated,
      paybackGeneratedError,
      generateGenerated,
      generateGeneratedError,
      handleChange,
      csdt,
      maxGenerated,
      onSubmitDeposit,
      onSubmitPayback,
      onSubmitGenerate,
      onSubmitWithdraw,
    } = this.props

    let content = null

    switch (action) {
      case 'deposit':
        content = <DepositCSDT
          onClose={ toggleActionModal }
          onSubmit={ onSubmitDeposit }
          handleChange={ handleChange }
          collateralDenom={ collateralDenom }
          csdtPrices={ csdtPrices }
          loading={ loading }
          accounts={ accounts }
          currentPrice={ currentPrice }
          projectedCollateralizationRatio={ projectedCollateralizationRatio }
          projectedLiquidationPrice={ projectedLiquidationPrice }
          depositCollateral={ depositCollateral }
          depositCollateralError={ depositCollateralError }
        />
        break;
      case 'generate':
        content = <GenerateCSDT
          onClose={ toggleActionModal }
          onSubmit={ onSubmitGenerate }
          handleChange={ handleChange }
          collateralDenom={ collateralDenom }
          csdtPrices={ csdtPrices }
          loading={ loading }
          accounts={ accounts }
          currentPrice={ currentPrice }
          projectedCollateralizationRatio={ projectedCollateralizationRatio }
          projectedLiquidationPrice={ projectedLiquidationPrice }
          generateGenerated={ generateGenerated }
          generateGeneratedError={ generateGeneratedError }
          maxGenerated={ maxGenerated }
        />
        break;
      case 'payback':
        content = <PaybackCSDT
          onClose={ toggleActionModal }
          onSubmit={ onSubmitPayback }
          handleChange={ handleChange }
          collateralDenom={ collateralDenom }
          csdtPrices={ csdtPrices }
          loading={ loading }
          accounts={ accounts }
          currentPrice={ currentPrice }
          projectedCollateralizationRatio={ projectedCollateralizationRatio }
          projectedLiquidationPrice={ projectedLiquidationPrice }
          paybackGenerated={ paybackGenerated }
          paybackGeneratedError={ paybackGeneratedError }
          csdt={ csdt }
        />
        break;
      case 'withdraw':
        content = <WithdrawCSDT
          onClose={ toggleActionModal }
          onSubmit={ onSubmitWithdraw }
          handleChange={ handleChange }
          collateralDenom={ collateralDenom }
          csdtPrices={ csdtPrices }
          loading={ loading }
          accounts={ accounts }
          currentPrice={ currentPrice }
          projectedCollateralizationRatio={ projectedCollateralizationRatio }
          projectedLiquidationPrice={ projectedLiquidationPrice }
          withdrawCollateral={ withdrawCollateral }
          withdrawCollateralError={ withdrawCollateralError }
        />
        break;
      case 'close':
        content = <CloseCSDT onClose={ toggleActionModal } onSubmit={ this.showPrivateKeyModal } collateralDenom={ collateralDenom } handleSelectChange={ handleSelectChange } csdtPrices={ csdtPrices } loading={ loading } accounts={ accounts } />
        break;
      default:
    }

    return (
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Paper square={ true } elevation={ 3 } style={ classes.actionPane }>
          {content}
        </Paper>
      </Slide>
    )
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
        <Grid item lg={6} xs={12} style={ classes.pricePair }>
          <Typography variant={ 'body1' }>{ (price.asset_code ? price.asset_code.toUpperCase() : 'unknown') + " / UUSD" }</Typography>
        </Grid>
        <Grid item lg={6} xs={12} style={ classes.pricePrice } align={ 'right' }>
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
        <Grid item lg={5} xs={12}  style={ classes.pricePair }>
          <Typography variant={ 'body1' }>{ asset.denom }</Typography>
        </Grid>
        <Grid item lg={7} xs={12} style={ classes.pricePrice } align={ 'right' }>
          <Typography variant={ 'h3' } style={{ display: 'inline-block' }}>{ parseFloat(asset.amount).toFixed(2) }</Typography>
          <Typography variant={ 'body1' } style={{ display: 'inline-block', width: '50px' }}>{ asset.denom }</Typography>
        </Grid>
      </React.Fragment>
    )
  }

  openAction(action) {
    this.props.openAction(action)
  }

  renderCSDTInfo() {

    const {
      csdt,
      csdtHistory,
      csdtPrices,
      collateralizationRatio,
      minimumCollateralizationRatio,
      warningCollateralizationRatio,
      liquidationPrice,
      currentPrice,
      collateralDenom,
      loading,
      onRefreshCSDT
    } = this.props

    const screenWidth = window.innerWidth

    const classes = {
      container: {
        width: '100%',
        minHeight: '100%',
        alignContent: 'flex-start',
        marginBottom: '12px'
      },
      header: {
        padding: '30px 0px',
        borderBottom: '1px solid #ccc'
      },
      headerButton: {
        padding: '33px 0px',
        borderBottom: '1px solid #ccc',
        verticalAlign: 'bottom'
      },
      title: {

      },
      openCSDT: {
        marginTop: '32px'
      },
      back: {
        marginTop: '32px',
        marginRight: '12px'
      },
      heading: {
        marginBottom: '42px'
      },
      infoContainer: {
        padding: '28px 0px',
        marginTop: '12px'
      },
      infoContainerRight: {
        padding: '28px 0px',
        borderLeft: '1px solid #ccc'
      },
      pricePair: {
        marginTop: '12px'
      },
      pricePrice: {
      },
      smaller: {
        fontSize: '14px'
      },
      larger: {
        fontSize: '18px'
      },
      circle:{
        borderRadius: '24px',
        height: '48px',
        width: '48px',
        border: '1px solid #ccc'
      },
      actionPane: {
        position: 'absolute',
        right: '0px',
        top: '0px',
        bottom: '0px',
        width: '480px',
      },
      balance: {
        fontSize: '36px',
        color: colors.lightBlack,
        display: 'inline-block',
        verticalAlign: 'middle'
      },
      denom: {
        display: 'inline-block',
        paddingLeft: '8px',
        paddingTop: '2px',
        verticalAlign: 'middle'
      },
      inlineBlock: {
        display: 'inline-block'
      },
      priceCombo: {
        padding: '12px',
        width: '250px',
        verticalAlign: 'middle',
        alignSelf: 'center'
      },
      centered: {
        textAlign: 'center'
      },
      ratioText: {
        marginTop: '12px'
      },
      fixedWidth: {
        width: '130px',
        textAlign: 'right'
      },
      variableWidth: {
        width: 'calc( 100% - 140px)'
      },
      ok: {
        width: '110px'
      },
      body: {
        position: 'relative'
      },
      refreshButton: {
        cursor: 'pointer'
      }
    }

    let inputData = [0]

    if(collateralizationRatio) {
      let warning = collateralizationRatio - minimumCollateralizationRatio > warningCollateralizationRatio ? warningCollateralizationRatio : (collateralizationRatio - minimumCollateralizationRatio)
      let leftOVer = parseInt(collateralizationRatio-minimumCollateralizationRatio-warning)
      inputData = [leftOVer, warning, parseInt(minimumCollateralizationRatio)]
    }

    const data = {
      datasets: [{
        data: inputData,
        backgroundColor: [
          colors.darkBlue,
          colors.orange,
          colors.red
        ]
      }],
      labels: [
        'Safe Ratio',
        'Warning Ratio',
        'Min Ratio',
      ]
    }

    const options = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      color: [
        'red'
      ]
    }

    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        style={classes.container}>
        <Grid item xs={6} >
          <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>{this.renderAssetSelect()} Collateral</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <RefreshIcon onClick={ onRefreshCSDT } style={ classes.refreshButton }/>
        </Grid>
        <Grid item xs={12} style={classes.body}>
          <Grid container>
            <Grid item xs={6} lg={2} style={ classes.priceCombo }>
              <div style={ classes.centered }>
                <Typography noWrap style={ classes.balance }>{ parseFloat(currentPrice).toFixed(4) }</Typography>
              </div>
              <Typography style={ classes.centered }>Current Price</Typography>
            </Grid>
            <Grid item xs={6} lg={3} style={ classes.priceCombo }>
              <div style={ classes.centered }>
                <Typography noWrap style={ classes.balance }>{ parseFloat(liquidationPrice).toFixed(4) }</Typography>
              </div>
              <Typography style={ classes.centered }>Liquidation Price</Typography>
            </Grid>
            <Grid item lg={2} xs={12}>
              <Doughnut
                ref={(reference) => this.chartReference = reference }
                data={data}
                width={200}
                height={200}
                options={ options }
              />
            </Grid>
            <Grid item xs={12} lg={5} style={ classes.priceCombo } align='left'>
              <Typography noWrap style={ {...classes.inlineBlock, ...classes.ratioText, ...classes.variableWidth} }>Current Collateralization Ratio</Typography> <Typography style={ {...classes.inlineBlock, ...classes.ratioText, ...classes.fixedWidth} } variant='h3'>{ collateralizationRatio } %</Typography>
              <Typography noWrap style={ {...classes.inlineBlock, ...classes.ratioText, ...classes.variableWidth} }>Minimum Collateralization Ratio</Typography> <Typography style={ {...classes.inlineBlock, ...classes.ratioText, ...classes.fixedWidth} } variant='h3'>{ minimumCollateralizationRatio } %</Typography>
            </Grid>
            <Grid
              item
              xs={12}
              lg={6}
              style={ classes.infoContainer }>
              <Grid container direction="row" justify="flex-start" alignItems="center" spacing={1}>
                <Grid item xs={screenWidth < 1280 ? 6 : 5 } style={ classes.pricePair }>
                  <Typography variant={ 'body1' } style={ classes.smaller }>Deposited</Typography>
                </Grid>
                <Grid item xs={3} style={ classes.pricePair } align={ 'right' }>
                  <Typography variant={ 'h3' } style={ classes.smaller }>{csdt.collateral} {collateralDenom.toUpperCase()}</Typography>
                </Grid>
                <Grid item xs={3} align={ 'right' }>
                  <Button
                    style={ classes.ok }
                    onClick={() => this.openAction('deposit')}
                    variant="contained"
                    size='medium'
                    color='secondary'
                    disabled={loading}
                    >
                      Deposit
                  </Button>
                </Grid>
                <Grid item xs={ screenWidth < 1280 ? 6 : 5 } style={ classes.pricePair }>
                  <Typography variant={ 'body1' } style={ classes.smaller }>Max available to withdraw</Typography>
                </Grid>
                <Grid item xs={3} style={ classes.pricePair } align={ 'right' }>
                  <Typography variant={ 'h3' } style={ classes.smaller }>{csdt.maxWithdraw} {collateralDenom.toUpperCase()}</Typography>
                </Grid>
                <Grid item xs={3} align={ 'right' }>
                  <Button
                    style={ classes.ok }
                    onClick={() => this.openAction('withdraw')}
                    variant="contained"
                    size='medium'
                    color='secondary'
                    disabled={loading}
                    >
                      Withdraw
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              lg={6}
              style={ classes.infoContainer }>
              <Grid container direction="row" justify={ screenWidth < 1280 ? "flex-start" : "flex-end" } alignItems="center" spacing={1}>
                <Grid item xs={screenWidth < 1280 ? 6 : 5 } style={ classes.pricePair }>
                  <Typography variant={ 'body1' } style={ classes.smaller }>Generated</Typography>
                </Grid>
                <Grid item xs={3} style={ classes.pricePrice } align={ 'right' }>
                  <Typography variant={ 'h3' } style={ classes.smaller }>{csdt.generated} UCSDT</Typography>
                </Grid>
                <Grid item xs={3} align={ 'right' }>
                  <Button
                    style={ classes.ok }
                    onClick={() => this.openAction('payback')}
                    variant="contained"
                    size='medium'
                    color='secondary'
                    disabled={loading}
                    >
                      Pay Back
                  </Button>
                </Grid>
                <Grid item xs={screenWidth < 1280 ? 6 : 5 } style={ classes.pricePairSmall }>
                  <Typography variant={ 'body1' } style={ classes.smaller }>Max available to generate</Typography>
                </Grid>
                <Grid item xs={3} style={ classes.pricePriceSmall } align={ 'right' }>
                  <Typography variant={ 'h3' } style={ classes.smaller }>{csdt.maxGenerated} UCSDT</Typography>
                </Grid>
                <Grid item xs={3} align={ 'right' }>
                  <Button
                    style={ classes.ok }
                    onClick={() => this.openAction('generate')}
                    variant="contained"
                    size='medium'
                    color='secondary'
                    disabled={loading}
                    >
                      Generate
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  /*

  <Grid item xs={12} style={classes.header}>
    <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>UCSDT History</Typography>
  </Grid>
  <Grid item xs={ 12 } style={classes.header}>
    <Grid container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
      spacing={2}>
      { this.renderHistoryItem() }
      { this.renderHistoryItem() }
    </Grid>
  </Grid>

  */

  renderHistoryItem() {

    const classes = {
      circle:{
        borderRadius: '24px',
        height: '48px',
        width: '48px',
        border: '1px solid #ccc'
      },
    }

    const item = {
      date: '2019-08-13',
      description: 'FTM Deposited'
    }

    return (
      <React.Fragment>
        <Grid item xs={1}>
          <div style={ classes.circle }></div>
        </Grid>
        <Grid item xs={11}>
          <Typography variant={ 'body1' } style={ classes.larger }>{item.description}</Typography>
          <Typography variant={ 'body1' } style={ classes.smaller }>{item.date}</Typography>
        </Grid>
      </React.Fragment>
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
      <MuiThemeProvider theme={ createMuiTheme(theme) }>
        <FormControl>
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
                  <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>{ val.toUpperCase() }</Typography>
                );
              }}
            >
              { csdtPrices
                ? csdtPrices.map(option => {
                    return (
                      <MenuItem key={option.asset_code} value={option.asset_code}>
                        <ListItemText primary={option.asset_code ? option.asset_code.toUpperCase() : 'Unknown'} />
                      </MenuItem>
                    );
                  })
                : ""}
          </Select>
        </FormControl>
      </MuiThemeProvider>
    )
  }
}

const theme = createMuiTheme({
  typography: {
    fontFamily: ['Montserrat-Medium', 'sans-serif'].join(","),
    useNextVariants: true,
    h2: {
      letterSpacing: '0.5px',
      fontFamily: ['Montserrat-SemiBold', 'sans-serif'].join(","),
      fontSize: '18px',
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      color: colors.lightBlack
    },
  },
  overrides: {
    MuiInputBase: {
      input: {
        color: colors.lightBlack
      },
      root: {
        padding: '0px 12px 0px 0px',
        '&:before': { //underline color when textfield is inactive
          backgroundColor: colors.lightBlack,
          height: '0px',
          width: '0px'
        }
      },
    },
    MuiSelect: {
      root: {
        padding: '0px 12px 0px 0px',
      },
      selectedMenu: {
        color: colors.lightBlack
      },
      select: {
        color: colors.lightBlack
      }
    },
    MuiSelect: {
      root: {
        padding: '0px 12px 0px 0px',
      },
      icon: {
        color: colors.lightBlack
      }
    },
  },
});

export default (CSDT);
