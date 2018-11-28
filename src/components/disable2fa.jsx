import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress  from '@material-ui/core/CircularProgress';

const styles = {};

class Disable2FA extends Component {

  render() {
    return (
      <Grid container justify="flex-start" alignItems="flex-start" style={{marginTop: '50px'}}>
        <Grid item xs={12} sm={10} align='left'>
          <Typography variant="display1">
            2FA
          </Typography>
        </Grid>
        <Grid item xs={12} sm={10} style={{marginTop: '24px'}}>
          <Typography>
            2 Factor Authentication is currently enabled on your account. It provides you with increased security so that your account remains safe.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={10} style={{marginTop: '24px', fontWeight: 'bold'}}>
          <Typography>
            We strongly recomend that you keep 2FA enabled on your account.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={10} style={{marginTop: '50px'}}>
          <Typography>
            Turn off 2 Factor Authentication? <Button variant="text" style={{border: '1px solid #ccc'}} size='medium' color='primary' onClick={this.props.submitDisable} disabled={this.props.loading}>Turn Off</Button>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={10} align='center'>
          <Typography style={{color: '#f44336'}} >
            {this.props.error}
          </Typography>
        </Grid>
        {this.props.loading && <CircularProgress size={36} style={{position: 'absolute',top: '50%',left: '50%',marginTop: -12,marginLeft: -12,}}/>}

      </Grid>
    );
  }
}

export default withStyles(styles)(Disable2FA);
