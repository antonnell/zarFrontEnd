import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Card, {  CardContent } from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';

const styles = {};

class HaveWanAddress extends Component {

  constructor(props) {
    super(props);

    this.renderMessage = this.renderMessage.bind(this);
    this.renderAddresses = this.renderAddresses.bind(this);
  };

  renderMessage() {
    if(this.props.wanAddresses.length > 0) {
      return (<Grid item xs={12} align='center'>
        <Typography variant="body2">
          This will be the address that we deposit the Wanchain into after the presale. We see that you already have a Wanchain address loaded on our system. Would like to use one of them, import a new Wanchain address, or would you like us to create one for you?
        </Typography>
        <List component="nav">
          {this.renderAddresses()}
        </List>
      </Grid>)
    } else {
      return (<Grid item xs={12} align='center'>
        <Typography variant="body2">
          This will be the address that we deposit the Wanchain into after the presale. Do you already have a Wanchain Address, or would you like us to create one for you?
        </Typography>
      </Grid>)
    }
  };

  renderAddresses() {
    return this.props.wanAddresses.map((address) => {
      return (
        <ListItem key={address.publicAddress} button onClick={(event) => { this.props.selectAddress(address); }}>
          <ListItemText primary={address.name} secondary={address.publicAddress} />
        </ListItem>
      )
    })
  };

  render() {
    return (
      <Grid container justify="flex-start" alignItems="flex-start" direction="row" spacing={0}>
        <Grid item xs={12} align='center' style={{marginBottom: '12px'}}>
          <Typography variant="title">
            Great! We need to know your Wanchain address.
          </Typography>
        </Grid>
        {this.renderMessage()}
        <Grid item xs={3} align='left' style={{marginTop: '24px '}}>
          <Button size="small" variant="flat" onClick={this.props.navigateBack}>Back</Button>
        </Grid>
        <Grid item xs={9} align='right' style={{marginTop: '24px '}}>
          <Button size="small" variant="raised" onClick={this.props.navigateExistingWanAddress} style={{marginRight: '12px'}}>Import Address</Button>
          <Button size="small" variant="raised" color="primary" onClick={this.props.navigateCreateWanAddress}>Create Address</Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(HaveWanAddress);