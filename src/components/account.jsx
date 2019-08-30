import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActionArea,
} from "@material-ui/core";

class Account extends Component {
  render() {
    if(this.props.viewMode === 'List') {
      return this.renderList()
    } else {
      return this.renderGrid()
    }
  }

  renderList() {
    let { account, cardClicked, transactClicked } = this.props

    let logo = 'Bitcoin'

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
      minWidth: '42px'
    }
    let nameStyle = {
      display: 'inline-block',
      verticalAlign: 'middle',
      width: 'calc( 100% - 42px)'
    }

    let ftmBalance = 0

    if(account.balances && account.balances.length > 0) {
      const balance = account.balances.filter((bal) => {
        return bal.denom === 'ftm'
      })

      ftmBalance = balance.length > 0 ? parseInt(balance[0].amount) : 0
    }

    return(
      <Grid item xs={12} align='left'>
        <Card style={{marginTop:'16px', borderRadius: '3px', cursor: 'pointer'}}>
          <Grid container justify="center" alignItems="center" direction="row">
            <Grid item xs={6} align='left' style={bodyStyle} onClick={() => {
              cardClicked(account) }
            }>
              <div style={iconStyle}>
                <img
                  alt=""
                  src={ require('../assets/images/'+logo+'-logo.png') }
                  height="30px"
                  style={{marginRight: '12px'}}
                />
              </div>
              <div style={nameStyle}>
                <Typography variant="h3" noWrap style={{ width: '100%' }}>
                  {account.name}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={2} align='right' style={bodyStyle} onClick={cardClicked}>
              <Typography variant="body1" noWrap style={textStyle}>
                {(ftmBalance ? ftmBalance.toFixed(4) : '0') + ' FTM'}
              </Typography>
              <Typography variant="subtitle2" noWrap>
                {"$" + (account.usdBalance ? account.usdBalance.toFixed(2) : '0')}
              </Typography>
            </Grid>
            <Grid item xs={4} align='right' style={bodyStyle}>
              <Button size="small" variant="outlined" color="primary" style={{ marginLeft: '12px' }} onClick={() => { transactClicked(null, null, account) }}>
                Transact
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    )
  }

  renderGrid() {
    let { account, cardClicked, transactClicked } = this.props

    let logo = 'Bitcoin'

    let ftmBalance = 0

    if(account.balances && account.balances.length > 0) {
      const balance = account.balances.filter((bal) => {
        return bal.denom === 'ftm'
      })

      ftmBalance = balance.length > 0 ? parseInt(balance[0].amount) : 0
    }


    return (

      <Card>
        <CardActionArea onClick={() => {
          cardClicked(account)
        }}>
          <CardContent style={{ position: "relative" }}>
            <div style={ {
              width: '150px',
              height: '150px',
              position: 'relative',
              backgroundImage: 'url("' + require('../assets/images/'+logo+'-logo.png') + '")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              margin: '50px auto'
             } }>
            </div>
            <div style={{ margin: '0 auto'}}>
              <Grid container >
                <Grid item xs={4} align='left'>
                  <Typography variant="h4" noWrap style={{ lineHeight: '39px' }}>
                    Balance
                  </Typography>
                </Grid>
                <Grid item xs={8} align='right'>
                  <Typography variant="h4" noWrap style={{fontSize: '20px'}}>
                    {(ftmBalance ? ftmBalance.toFixed(4) : '0') + ' FTM'}
                  </Typography>
                  <Typography variant="h4" noWrap style={{color: '#888'}}>
                    {"$" + (account.usdBalance ? account.usdBalance.toFixed(2) : '0')}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </CardActionArea>
        <CardContent style={{ position: "relative" }}>
          <Grid container style={{marginTop: '12px'}}>
            <Grid item xs={12} align='right'>
              <Button size="small" variant="contained" color="primary" onClick={() => { transactClicked(null, null, account) }}>
                Transact
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default Account;
