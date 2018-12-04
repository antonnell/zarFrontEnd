import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {};

class ImportPrivateTypeWanAddress extends Component {

  render() {
    return (
      <Grid container justify="flex-start" alignItems="flex-start" direction="row" spacing={40} style={{padding:20}}>
        <Grid item xs={12} align='center' style={{marginBottom: '12px'}}>
          <Typography variant="h6">
            Great! We need to know your Wanchain address.
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography variant="body1">
            How would you like to give us your key?
          </Typography>
        </Grid>
        <Grid item xs={4} align='center' style={{marginTop: '24px '}}>
          <Button size="small" variant="contained" color="primary" onClick={() => {this.props.navigateImportPrivateWanAddress('privateKey')}}>Private Key</Button>
        </Grid>
        <Grid item xs={4} align='center' style={{marginTop: '24px '}}>
          <Button size="small" variant="contained" color="primary" onClick={() => {this.props.navigateImportPrivateWanAddress('mnemonic')}}>Mnemonic</Button>
        </Grid>
        <Grid item xs={4} align='center' style={{marginTop: '24px '}}>
          <Button size="small" variant="contained" color="primary" onClick={() => {this.props.navigateImportPrivateWanAddress('jsonV3')}}>JSONv3</Button>
        </Grid>
        <Grid item xs={12} align='left' style={{marginTop: '24px '}}>
          <Button size="small" variant="text" onClick={this.props.navigateBack}>Back</Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ImportPrivateTypeWanAddress);
