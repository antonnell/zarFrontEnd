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
    const { account, cardClicked, transactClicked } = this.props
    const ftmBalance = this.getBalance(account)

    const styles = {
      bodyStyle: {
        padding: '12px 12px 12px 24px',
      },
      textStyle: {
        color: '#2f3031',
        fontSize: '14px',
        fontWeight: '400'
      },
      iconStyle: {
        display: 'inline-block',
        verticalAlign: 'middle',
        minWidth: '42px'
      },
      nameStyle: {
        display: 'inline-block',
        verticalAlign: 'middle',
        width: 'calc( 100% - 42px)'
      }
    }

    return(
      <Grid item xs={12} align='left'>
        <Card style={{marginTop:'16px', borderRadius: '3px', cursor: 'pointer'}}>
          <Grid container justify="center" alignItems="center" direction="row">
            <Grid item xs={6} align='left' style={styles.bodyStyle} onClick={() => {
              cardClicked(account) }
            }>
              <div style={styles.iconStyle}>
                <img
                  alt=""
                  src={ require('../assets/images/Xar-logo.png') }
                  height="30px"
                  style={{marginRight: '12px'}}
                />
              </div>
              <div style={styles.nameStyle}>
                <Typography variant="h3" noWrap style={{ width: '100%' }}>
                  {account.name}
                </Typography>
                <Typography variant="subtitle2" noWrap>
                  { ['ZAR', 'XAR'].includes(account.account_type) ? account.address : 'Savings Account'}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={2} align='right' style={styles.bodyStyle} onClick={cardClicked}>
              <Typography variant="body1" noWrap style={styles.textStyle}>
                { ['ZAR', 'XAR'].includes(account.account_type) ? ((ftmBalance ? ftmBalance.toFixed(0) : '0') + ' UFTM') : ' UZAR'}
              </Typography>

            </Grid>
            {
              ['ZAR', 'XAR'].includes(account.account_type) ? (<Grid item xs={4} align='right' style={styles.bodyStyle}>
                <Button size="small" variant="outlined" color="primary" style={{ marginLeft: '12px' }} onClick={() => { transactClicked(null, null, account) }}>
                  Payments
                </Button>
              </Grid>)
              :
              (<Grid item xs={4} align='right' style={styles.bodyStyle}>
                <Button size="small" variant="outlined" color="secondary" style={{ marginLeft: '12px' }} onClick={() => { transactClicked(null, null, account, 'Invest') }}>
                  Deposit
                </Button>
                <Button size="small" variant="outlined" color="primary" style={{ marginLeft: '12px' }} onClick={() => { transactClicked(null, null, account, 'Invest') }}>
                  Withdraw
                </Button>
              </Grid>)
            }
          </Grid>
        </Card>
      </Grid>
    )
  }
  /*
    <Button size="small" variant="outlined" color="secondary" style={{ marginLeft: '12px' }} onClick={() => { transactClicked(null, null, account, 'Invest') }}>
      Invest
    </Button>*/

  /*<Typography variant="subtitle2" noWrap>
    {"$" + (account.usdBalance ? account.usdBalance.toFixed(2) : '0')}
  </Typography>*/

  getBalance(account) {
    let ftmBalance = 0

    if(account.balances && account.balances.length > 0) {
      const balance = account.balances.filter((bal) => {
        return bal.denom === 'uftm'
      })

      ftmBalance = balance.length > 0 ? parseInt(balance[0].amount) : 0
    }

    return ftmBalance
  }

  renderGrid() {
    const { account, cardClicked, transactClicked } = this.props
    const ftmBalance = this.getBalance(account)

    return (

      <Card>
        <CardActionArea onClick={() => {
          cardClicked(account)
        }}>
          <CardContent style={{ position: "relative" }}>
            <div style={{ margin: '0 auto'}}>
              <Grid container>
                <Grid item xs={12} align='left'  style={{ marginBottom: '12px' }}>
                  <Typography variant="h3" noWrap style={{ width: '100%' }}>
                    {account.name}
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    { ['ZAR', 'XAR'].includes(account.account_type) ? account.address : 'Savings Account'}
                  </Typography>
                </Grid>
                <Grid item xs={4} align='left'>
                  <Typography variant="h4" noWrap style={{ lineHeight: '39px' }}>
                    Balance
                  </Typography>
                </Grid>
                <Grid item xs={8} align='right'>
                  <Typography variant="h4" noWrap style={{fontSize: '20px', lineHeight: '39px'}}>
                    { ['ZAR', 'XAR'].includes(account.account_type) ? ((ftmBalance ? ftmBalance.toFixed(0) : '0') + ' UFTM') : (account.balance + ' UZAR')}
                  </Typography>

                </Grid>
              </Grid>
            </div>
          </CardContent>
        </CardActionArea>
        <CardContent style={{ position: "relative" }}>
          {
            ['ZAR', 'XAR'].includes(account.account_type) ? (
              <Grid container style={{marginTop: '12px'}}>

                <Grid item xs={12} align='right'>
                  <Button size="small" variant="contained" color="primary" onClick={() => { transactClicked(null, null, account) }}>
                    Payments
                  </Button>
                </Grid>
              </Grid>)
              :
              (<Grid container style={{marginTop: '12px'}}>
                <Grid item xs={6} align='left'>
                  <Button size="small" variant="contained" color="secondary" onClick={() => { transactClicked(null, null, account, 'Invest') }}>
                    Deposit
                  </Button>
                </Grid>
                <Grid item xs={6} align='right'>
                  <Button size="small" variant="contained" color="primary" onClick={() => { transactClicked(null, null, account, 'Invest') }}>
                    Withdraw
                  </Button>
                </Grid>
              </Grid>)
            }
        </CardContent>
      </Card>
    );
  }
  /*<Grid item xs={6} align='left'>
    <Button size="small" variant="contained" color="secondary" onClick={() => { transactClicked(null, null, account, 'Invest') }}>
      Invest
    </Button>
  </Grid>*/
  /*<Typography variant="h4" noWrap style={{color: '#888'}}>
    {"$" + (account.usdBalance ? account.usdBalance.toFixed(2) : '0')}
  </Typography>*/
}

export default Account;
