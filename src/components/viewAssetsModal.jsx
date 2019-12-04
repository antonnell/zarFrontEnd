import React, { Component } from "react";
import {
  DialogActions,
  DialogContent,
  Dialog,
  Button,
  Typography,
  Grid,
  Card,
  Slide
} from '@material-ui/core';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


class ViewAssetsModal extends Component {

  renderAssets() {
    let { balances, assets, nativeDenoms } = this.props

    if(balances && balances.length > 0 ) {
      return balances.map((balance) => {

        const nativeDenom = nativeDenoms ? nativeDenoms.filter((nativeDenom) => {
          return nativeDenom.denom === balance.denom
        }) : []
        if(nativeDenom.length > 0) {
          balance.name = nativeDenom[0].name
          balance.symbol = nativeDenom[0].denom
        } else {
          const asset = assets ? assets.filter((asset) => {
            return asset.issue_id === balance.denom
          }) : []
          if(asset.length > 0) {
            balance.name = asset[0].name
            balance.symbol = asset[0].symbol
          }
        }

        return this.renderAsset(balance)
      })
    } else {
      //something went wrong
    }
  }

  renderHeader() {
    let headerStyle = {
      padding: '16px',
      backgroundColor: '#2f3031'
    }
    let textStyle = {
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600'
    }

    return (<Grid item xs={12} align='left'>
      <Card style={{borderRadius: '3px'}}>
        <Grid container>
          <Grid item xs={5} align='left' style={headerStyle}>
            <Typography variant="body1" style={textStyle}>
              Asset
            </Typography>
          </Grid>
          <Grid item xs={4} align='left' style={headerStyle}>
            <Typography variant="body1" style={textStyle}>
              Balance
            </Typography>
          </Grid>
          <Grid item xs={3} align='right' style={headerStyle}>
            <Typography variant="body1" style={textStyle}>
              Actions
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>)
  }

  renderAsset(asset) {

    let bodyStyle = {
      padding: '16px',
    }
    let textStyle = {
      color: '#2f3031',
      fontSize: '14px',
      fontWeight: '400',
      verticalAlign: 'middle'
    }
    let divStyle = {
      display: 'inline-block',
      verticalAlign: 'middle'
    }

    return(
      <Grid item xs={12} align='left'>
        <Card style={{marginTop:'16px', borderRadius: '3px'}}>
          <Grid container justify="center" alignItems="center" direction="row">
            <Grid item xs={5} align='left' style={bodyStyle}>
              <div style={divStyle}>
                <Typography variant="body1" style={textStyle}>
                  {
                    asset.name
                  }
                </Typography>
              </div>
            </Grid>
            <Grid item xs={4} align='left' style={bodyStyle}>
              <Typography variant="body1" style={textStyle}>
                { parseFloat( asset.amount != null ? parseInt(asset.amount) : 0 ).toFixed(0) + ' ' + asset.symbol }
              </Typography>
            </Grid>
            <Grid item xs={3} align='right' style={bodyStyle}>
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={() => { this.props.transactClicked(asset, null, this.props.account) }}
              >
                Pay
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    )
  }

  render() {
    return (
      <Dialog open={this.props.isOpen} onClose={this.props.handleClose} fullWidth={true} maxWidth={'md'} TransitionComponent={Transition}>
        <DialogContent>
          <Grid container justify="flex-start" alignItems="flex-start" direction="row" spacing={0} style={{padding: '24px'}}>
            {this.renderHeader()}
            {this.renderAssets()}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={this.props.createLoading} variant='contained' size='small' onClick={this.props.handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
}

export default (ViewAssetsModal);
