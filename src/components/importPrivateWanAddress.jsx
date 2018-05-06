import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Card, {  CardContent } from 'material-ui/Card';

const styles = {};

class ImportPrivateWanAddress extends Component {

  constructor(props) {
    super(props);
  };

  render() {

    var input = null
    switch (this.props.keyType) {
      case 'mnemonic':
        input = <TextField style={{maxWidth:'400px', width: '100%'}} fullWidth={false} required color="textSecondary" error={this.props.wanMnemonicError} disabled={this.props.loading}
          id="wanMnemonic" placeholder="Mnemonic String" value={this.props.wanMnemonic}
          onChange={(event) => { this.props.handleChange(event, 'wanMnemonic'); }} margin="normal" onKeyDown={this.props.onImportKeyDown} />
        break;
      case 'jsonV3':
        input = <TextField style={{maxWidth:'400px', width: '100%'}} fullWidth={false} required color="textSecondary" error={this.props.wanJSONV3Error} disabled={this.props.loading}
          id="wanJSONV3" placeholder="Enter your JSON" value={this.props.wanJSONV3}
          onChange={(event) => { this.props.handleChange(event, 'wanJSONV3'); }} margin="normal" onKeyDown={this.props.onImportKeyDown} />
        break;
      default:
        input = <TextField style={{maxWidth:'400px', width: '100%'}} fullWidth={false} required color="textSecondary" error={this.props.wanPrivateKeyError} disabled={this.props.loading}
          id="wanPrivateKey" placeholder="Private Key" value={this.props.wanPrivateKey}
          onChange={(event) => { this.props.handleChange(event, 'wanPrivateKey'); }} margin="normal" onKeyDown={this.props.onImportKeyDown} />
        break;
    }

    return (
      <Grid container justify="flex-start" alignItems="flex-start" direction="row" spacing={0}>
        <Grid item xs={12} align='center' style={{marginBottom: '12px'}}>
          <Typography variant="title">
            Great! We need to know your Wanchain address.
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography variant="body2">
            Please provide us with the details of your Wanchain Address. We will store them safely on our system and you will be able to interact with your address later on.
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          {input}
        </Grid>
        <Grid item xs={3} align='left' style={{marginTop: '24px '}}>
          <Button size="small" variant="flat" onClick={this.props.navigateBack}>Back</Button>
        </Grid>
        <Grid item xs={9} align='right' style={{marginTop: '24px '}}>
          <Button size="small" variant="raised" color="secondary" onClick={this.props.importPrivateWanAddress}>Import my address</Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ImportPrivateWanAddress);