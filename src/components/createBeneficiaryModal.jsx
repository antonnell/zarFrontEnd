import React, { Component } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import SectionLoader from './sectionLoader';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


class CreateBeneficiaryModal extends Component {
  render() {
    return (
      <Dialog open={this.props.isOpen} onClose={this.props.handleClose} fullWidth={true} maxWidth={'md'} TransitionComponent={Transition}>
        <DialogContent>
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            direction="row"
            spacing={0}
            style={{ padding: "24px" }}
          >
            <Grid item xs={12} align="left">
              <Typography variant="h5">Create Beneficiary</Typography>
            </Grid>
            <Grid item xs={12} sm={10} md={9} lg={7} align="left">
              <TextField
                fullWidth={true}
                autoFocus
                required
                color="textSecondary"
                error={this.props.nameError}
                disabled={this.props.loading}
                id="name"
                label="Beneficiary Name"
                value={this.props.name}
                onChange={event => {
                  this.props.handleChange(event, "name");
                }}
                margin="normal"
                onKeyDown={this.props.onCreateKeyDown}
                onBlur={event => {
                  this.props.validateField(event, "name");
                }}
                helperText={this.props.nameErrorMessage}
              />
              <TextField
                fullWidth={true}
                required
                color="textSecondary"
                error={this.props.emailAddressError}
                disabled={this.props.loading}
                id="emailAddress"
                label="Email Address"
                value={this.props.emailAddress}
                onChange={event => {
                  this.props.handleChange(event, "emailAddress");
                }}
                margin="normal"
                onKeyDown={this.props.onCreateKeyDown}
                onBlur={event => {
                  this.props.validateField(event, "emailAddress");
                }}
                helperText={this.props.emailAddressErrorMessage}
              />
              <TextField
                fullWidth={true}
                required
                color="textSecondary"
                error={this.props.mobileNumberError}
                disabled={this.props.loading}
                id="mobileNumber"
                label="Mobile Number"
                value={this.props.mobileNumber}
                onChange={event => {
                  this.props.handleChange(event, "mobileNumber");
                }}
                margin="normal"
                onKeyDown={this.props.onCreateKeyDown}
                onBlur={event => {
                  this.props.validateField(event, "mobileNumber");
                }}
                helperText={this.props.mobileNumberErrorMessage}
              />
              <TextField
                fullWidth={true}
                required
                color="textSecondary"
                error={this.props.walletAddressError}
                disabled={this.props.loading}
                id="walletAddress"
                label="Wallet Address"
                value={this.props.walletAddress}
                onChange={event => {
                  this.props.handleChange(event, "walletAddress");
                }}
                margin="normal"
                onKeyDown={this.props.onCreateKeyDown}
                onBlur={event => {
                  this.props.validateField(event, "walletAddress");
                }}
                helperText={this.props.walletAddressErrorMessage}
              />
              <TextField
                fullWidth={true}
                required
                color="textSecondary"
                error={this.props.referenceError}
                disabled={this.props.loading}
                id="reference"
                label="Reference"
                value={this.props.reference}
                onChange={event => {
                  this.props.handleChange(event, "reference");
                }}
                margin="normal"
                onKeyDown={this.props.onCreateKeyDown}
                onBlur={event => {
                  this.props.validateField(event, "reference");
                }}
                helperText={this.props.referenceErrorMessage}
              />
            </Grid>
          </Grid>
          {this.props.loading ? (
            <SectionLoader />
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={this.props.loading}
            variant='contained'
            size='small'
            onClick={this.props.createClicked}
            color="primary"
          >
            Create Beneficiary
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default CreateBeneficiaryModal;
