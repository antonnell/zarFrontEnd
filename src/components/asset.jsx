import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActionArea,
} from "@material-ui/core";

class Asset extends Component {
  render() {
    if(this.props.viewMode === 'List') {
      return this.renderList()
    } else {
      return this.renderGrid()
    }
  }

  renderList() {
    let {
      asset,
      mintAssetClicked,
      burnAssetClicked,
      user,
      owner
    } = this.props

    let logo = 'footer'

    let bodyStyle = {
      padding: '12px 12px 12px 24px',
    }
    let textStyle = {
      color: '#2f3031',
      fontSize: '14px',
      fontWeight: '400'
    }
    let iconStyle = {
      display: 'inline-block',
      verticalAlign: 'middle',
      width: '30px',
      marginRight: '12px'
    }
    let nameStyle = {
      display: 'inline-block',
      verticalAlign: 'middle'
    }

    return(
      <Grid item xs={12} align='left'>
        <Card style={{marginTop:'16px', borderRadius: '3px'}}>
          <Grid container justify="center" alignItems="center" direction="row">
            <Grid item xs={4} align='left' style={bodyStyle} >
              <div style={iconStyle}>
                <img
                  alt=""
                  src={ asset.icon ? asset.icon : '' }
                  width="30px"
                  style={{marginRight: '12px'}}
                />
              </div>
              <div style={nameStyle}>
                <Typography variant="h3" noWrap style={{ width: '100%' }}>
                  {asset.name}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={2} align='right' style={bodyStyle} >
              <Typography variant="body1" noWrap style={textStyle}>
                {asset.total_supply + ' ' + asset.symbol}
              </Typography>
            </Grid>
            { owner === true && user && asset.user_uuid === user.uuid && <Grid item xs={6} align='right' style={bodyStyle}>
              <Button style={{ border: 'none' }} size="small" variant="text" color="primary" onClick={() => {  }}>
                List
              </Button>
              <Button style={{ border: 'none' }} size="small" variant="text" color="primary" onClick={ () => { burnAssetClicked(asset); } }>
                Burn
              </Button>
              <Button style={{ border: 'none' }} size="small" variant="text" color="primary" onClick={ () => { mintAssetClicked(asset); } }>
                Mint
              </Button>
            </Grid>}
            { asset.user_uuid !== user.uuid && <Grid item xs={6} align='right' style={bodyStyle}></Grid> }
          </Grid>
        </Card>
      </Grid>
    )
  }

  renderGrid() {
    let {
      asset,
      mintAssetClicked,
      burnAssetClicked,
      user,
      owner
    } = this.props

    let logo = 'footer'

    return (

      <Card>
        <CardContent style={{ position: "relative" }}>
          <div style={ {
            width: 'auto',
            height: 'auto',
            position: 'relative',
            backgroundImage: asset.icon ? "url('"+asset.icon+"')" : '',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            margin: '0 auto',
            minHeight: '260px'
           } }>
          </div>
          <div style={{ margin: '0 auto'}}>
            <Grid container >
            <Grid item xs={5} align='left'>
                <Typography variant="h5" noWrap style={{ lineHeight: '35px', fontSize:  '39px' }}>
                  { asset.symbol }
                </Typography>
              </Grid>
              <Grid item xs={7} align='right'>
                <Typography variant="h2" noWrap>
                  Total Supply
                </Typography>
                <Typography variant="subtitle2" noWrap>
                  { asset.total_supply + ' ' + asset.symbol }
                </Typography>
              </Grid>
            </Grid>
          </div>
        </CardContent>
        { owner === true && user && asset.user_uuid === user.uuid && <CardContent style={{ position: "relative" }}>
          <Grid container style={{marginTop: '12px'}}>
            <Grid item xs={4} align='left'>
              <Button style={{ border: 'none' }} size="small" variant="text" color="primary" onClick={() => {  }}>
                List
              </Button>
            </Grid>
            <Grid item xs={4} align='center'>
              <Button style={{ border: 'none' }} size="small" variant="text" color="primary" onClick={ () => { burnAssetClicked(asset); } }>
                Burn
              </Button>
            </Grid>
            <Grid item xs={4} align='right'>
              <Button style={{ border: 'none' }} size="small" variant="text" color="primary" onClick={ () => { mintAssetClicked(asset); } }>
                Mint
              </Button>
            </Grid>
          </Grid>
        </CardContent>}
      </Card>
    );
  }
}

export default Asset;
