import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Card, {  CardContent } from 'material-ui/Card';

const styles = {};

class CreateWanAddress extends Component {

  constructor(props) {
    super(props);
  };

  render() {
    return (
      <Grid container justify="flex-start" alignItems="flex-start" direction="row" spacing={40}>
        <Grid item xs={12} align='center' style={{marginBottom: '12px'}}>
          <Typography variant="title">
            Good choice! Let create a new Wanchain account.
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography variant="body2">
            In order to make this as simple as possible, we just need a friendly name for your address.
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography variant="body2">
             What would you like to name your new Wanchain address?
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <TextField style={{maxWidth:'400px', width: '100%'}} fullWidth={false} required color="textSecondary" error={this.props.wanchainAddressNameError} disabled={this.props.loading}
            id="wanchainAddressName" placeholder="Wanchain Address Name" value={this.props.wanchainAddressName}
            onChange={(event) => { this.props.handleChange(event, 'wanchainAddressName'); }} margin="normal" onKeyDown={this.props.onCreateKeyDown}
            helperText={this.props.wanchainAddressNameErrorMessage} />
        </Grid>
        <Grid item xs={3} align='left' style={{marginTop: '24px '}}>
          <Button size="small" variant="flat" onClick={this.props.navigateBack}>Back</Button>
        </Grid>
        <Grid item xs={9} align='right' style={{marginTop: '24px '}}>
          <Button size="small" variant={this.props.wanchainAddressNameValid?"raised":"flat"} disabled={!this.props.wanchainAddressNameValid} color="primary" onClick={this.props.createWanAddress}>Create address</Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(CreateWanAddress);
