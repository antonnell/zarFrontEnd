import React, { Component } from 'react'
import { Grid, Typography, Button, TextField, InputAdornment, SvgIcon } from '@material-ui/core'
import {
  withStyles, createMuiTheme, MuiThemeProvider
} from '@material-ui/core/styles';

function CloseIcon(props) {
  return (
    <SvgIcon onClick={props.onClick} style={props.style}>
      <path
        fill={"#FFF"}
        d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
      />
    </SvgIcon>
  );
}

class DepositCSDT extends Component {

  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    const {
      onClose,
      onSubmit,
      collateralDenom,
      depositCollateral,
      depositCollateralError,
      accounts,
      currentPrice,
      projectedCollateralizationRatio,
      projectedLiquidationPrice,
      handleChange,
      loading
    } = this.props;

    const primaryAccount = accounts.filter((account) => {
      return account.account_type === 'XAR'
    })

    let balance = 0

    if(primaryAccount && primaryAccount.length > 0) {
      const assets = primaryAccount[0].balances

      balance = assets.filter((asset) => {
        return asset.denom === collateralDenom
      })

      if(balance && balance.length > 0) {
        balance = balance[0].amount
      }
    }

    const minCollateral = 50

    const classes = {
      container: {
        padding: '30px'
      },
      closeButton: {
        cursor: 'pointer'
      },
      title: {
        marginBottom: '32px',
        color: "#FFF"
      },
      button: {
        marginTop: '32px',
        color: "#FFF"
      },
      infoTitle: {
        marginTop: '12px',
        color: "#FFF"
      },
      infoValue: {
        marginTop: '6px',
        color: "#FFF"
      },
      sepperate: {
        marginTop: '32px'
      },
      textField: {
        color: "#FFF !important"
      }
    }

    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        style={ classes.container }>
        <Grid item xs={10} style={classes.header}>
          <Typography variant="h2" style={ classes.title }>Deposit Collateral</Typography>
        </Grid>
        <Grid item xs={2} align="right">
          <CloseIcon onClick={onClose} style={ classes.closeButton }/>
        </Grid>
        <Grid item xs={12} style={ classes.sepperate }>
          <Typography variant="body1" style={{ color: "#FFF" }}>How much { collateralDenom.toUpperCase() } would you like to deposit?</Typography>
          <CustomTextField
            margin="normal"
            variant="outlined"
            onChange={ handleChange }
            value={ depositCollateral }
            id="depositCollateral"
            error={ depositCollateralError }
            InputProps={{
              endAdornment: <InputAdornment position="end">{ collateralDenom.toUpperCase() }</InputAdornment>,
            }}
            helperText={"Min. "+ collateralDenom.toUpperCase() +" required: "+minCollateral+" "+ collateralDenom.toUpperCase() }
          />
        </Grid>
        <Grid item xs={12} style={ classes.sepperate }>
          <Typography variant="body1" style={ classes.infoTitle }>Current account balance</Typography>
          <Typography variant="h3" style={ classes.infoValue }>{ balance } {collateralDenom.toUpperCase()}</Typography>
          <Typography variant="body1" style={ classes.infoTitle }>Current price information ({collateralDenom.toUpperCase()}/UUSD)</Typography>
          <Typography variant="h3" style={ classes.infoValue }>{ currentPrice } UUSD</Typography>
          <Typography variant="body1" style={ classes.infoTitle }>Projected liquidation price ({collateralDenom.toUpperCase()}/UUSD)</Typography>
          <Typography variant="h3" style={ classes.infoValue }>{ projectedLiquidationPrice } UUSD</Typography>
          <Typography variant="body1" style={ classes.infoTitle }>Projected collateralization ratio</Typography>
          <Typography variant="h3" style={ classes.infoValue }>{ projectedCollateralizationRatio } %</Typography>
        </Grid>
        <Grid item xs={6} style={ classes.sepperate }>
          <Button
            style={ classes.button }
            variant="text"
            size='medium'
            color='secondary'
            onClick={onClose}
            disabled={ loading }
            >
              Cancel
          </Button>
        </Grid>
        <Grid item xs={6} align="right" style={ classes.sepperate }>
          <Button
            style={ classes.button }
            variant="contained"
            size='medium'
            color='primary'
            onClick={onSubmit}
            disabled={ loading }
            >
              Deposit
          </Button>
        </Grid>
      </Grid>
    )
  }
}

const CustomTextField = withStyles({
  root: {
    '& input': {
      color: '#fff'
    },
    '& label.Mui-focused': {
      color: '#fff',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fff',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#fff',
      },
      '&:hover fieldset': {
        borderColor: '#fff',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fff',
      },
    },
  },
})(TextField);

export default DepositCSDT
