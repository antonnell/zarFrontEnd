import React, { Component } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

let config = require('../config')

class ThankYouICO extends Component {

  render() {
    let url = config.wanscanURL+this.props.investTransacstionID
    return (
      <Dialog open={this.props.isOpen} title="Invest" onClose={this.props.handleClose} >
        <DialogTitle id="alert-dialog-title">Thank You</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ color: '#333'}}>
            <Typography variant="body1" style={{marginBottom: '12px'}}>
              Thank you for your contribution to the CryptoCurve ICO.
            </Typography>
            <Typography variant="body1">
              You can view the progress of your transaction using the following transaction ID: <a href={url} target="_blank">{this.props.investTransacstionID}</a>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary" variant='contained'  >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
}

export default (ThankYouICO);
