import React, { Component } from "react";
import {
  Grid,
  Typography
} from '@material-ui/core';

class ConfirmPayment extends Component {

  renderBeneficiary() {
    let {
      beneficiaryOptions,
      beneficiaryValue
    } = this.props

    return (<Grid item xs={10} align='left' style={{ marginTop: '40px' }}>
      <Typography variant='body1' style={{ fontSize: '11px' }}>
        To
      </Typography>
      <Typography variant="h5" noWrap style={{ fontSize:  '20px', marginTop: '4px' }}>
        { beneficiaryOptions.filter((option) => {
          return beneficiaryValue === option.value
        })[0].description }
      </Typography>
    </Grid>)
  };

  renderPublic() {
    let {
      publicValue
    } = this.props
    return (<Grid item xs={10} align='left' style={{ marginTop: '40px' }}>
      <Typography variant='body1' style={{ fontSize: '11px' }}>
        To
      </Typography>
      <Typography variant="h5" noWrap style={{ fontSize:  '20px', marginTop: '4px' }}>
        { publicValue }
      </Typography>
    </Grid>)
  };

  renderOwnAccount() {
    let {
      ownOptions,
      ownValue
    } = this.props
    return (<Grid item xs={10} align='left' style={{ marginTop: '40px' }}>
      <Typography variant='body1' style={{ fontSize: '11px' }}>
        To
      </Typography>
      <Typography variant="h5" noWrap style={{ fontSize:  '20px', marginTop: '4px' }}>
        { ownOptions.filter((option) => {
          return ownValue === option.value
        })[0].description }
      </Typography>
    </Grid>)
  };

  render() {

    let {
      amountValue,
      accountOptions,
      accountValue,
      typeValue,
      assetValue,
      assets,
      referenceValue
    } = this.props

    const asset = assets.filter((ass) => {
      console.log(ass)
      return ass.value == assetValue
    })[0].description

    return (
        <Grid container justify="center" alignItems="flex-start" direction="row">
          <Grid item xs={10} align='left'>
            <Typography variant='body1' style={{ fontSize: '11px' }}>
              You're sending
            </Typography>
            <Typography variant="h5" noWrap style={{ fontSize:  '20px', marginTop: '4px' }}>
              { amountValue + " " + asset }
            </Typography>
          </Grid>
          <Grid item xs={10} align='left' style={{ marginTop: '40px' }}>
            <Typography variant='body1' style={{ fontSize: '11px' }}>
              From
            </Typography>
            <Typography variant="h5" noWrap style={{ fontSize:  '20px', marginTop: '4px' }}>
              { accountOptions.filter((option) => {
                return accountValue === option.value
              })[0].description }
            </Typography>
          </Grid>
          { typeValue==='beneficiary' && this.renderBeneficiary() }
          { typeValue==='own' && this.renderOwnAccount() }
          { typeValue==='public' && this.renderPublic() }
          <Grid item xs={10} align='left' style={{ marginTop: '40px' }}>
            <Typography variant='body1' style={{ fontSize: '11px' }}>
              Reference
            </Typography>
            <Typography variant="h5" noWrap style={{ fontSize:  '20px', marginTop: '4px' }}>
              { referenceValue }
            </Typography>
          </Grid>
        </Grid>
    );
  };
}

export default (ConfirmPayment);
