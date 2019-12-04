import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import {
  Typography,
  Button,
  Card,
  CardContent,
} from "@material-ui/core";

class Denom extends Component {
  render() {
    if(this.props.viewMode === 'List') {
      return this.renderList()
    } else {
      return this.renderGrid()
    }
  }

  renderList() {
    let {
      denom,
    } = this.props

    // let logo = 'footer'

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
            <Grid item xs={6} align='left' style={bodyStyle} >
              <div style={iconStyle}>
                <img
                  alt=""
                  src={ denom.icon ? denom.icon : '' }
                  width="30px"
                  style={{marginRight: '12px'}}
                />
              </div>
              <div style={nameStyle}>
                <Typography variant="h3" noWrap style={{ width: '100%' }}>
                  { denom.name }
                </Typography>
              </div>
            </Grid>
            <Grid item xs={2} style={bodyStyle} >
              <Typography variant="body1" noWrap style={textStyle}>
                { denom.denom.toUpperCase() }
              </Typography>
            </Grid>
            <Grid item xs={4} align='right' style={bodyStyle} >
              <Typography variant="body1" noWrap style={textStyle}>
                { denom.amount + ' ' + denom.denom }
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    )
  }

  renderGrid() {
    let {
      denom,
    } = this.props

    return (
      <Card>
        <CardContent style={{ position: "relative" }}>
          <div style={ {
            width: 'auto',
            height: 'auto',
            position: 'relative',
            backgroundImage: denom.image_data ? "url('"+denom.image_data+"')" : '',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            margin: '0 auto',
            minHeight: '260px'
           } }
           >
          </div>
          <div style={{ margin: '0 auto', paddingTop: '12px'}}>
            <Grid container >
              <Grid item xs={6} align='left'>
                <Typography variant="h5" noWrap style={{ lineHeight: '35px', fontSize:  '39px' }}>
                  { denom.denom.toUpperCase() }
                </Typography>
              </Grid>
              <Grid item xs={6} align='right'>
                <Typography variant="h2" noWrap>
                  Total Supply
                </Typography>
                <Typography variant="subtitle2" noWrap>
                  { denom.amount + ' ' + denom.denom }
                </Typography>
              </Grid>
            </Grid>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default Denom;
