import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditEmailModal from './editEmailModal';

class Profile extends Component {
  render() {

    return (
      <Grid container justify="flex-start" alignItems="center" direction="row" spacing={0}  style={{marginTop: '24px'}}>
        <Grid item xs={12} sm={10} md={10} lg={10} align='left'>
          <Typography variant="display2">
            Profile Picture
          </Typography>
          <div style={{margin: '48px 12px', display: 'flex'}}>
            <div style={{width: '120px', height: '120px', borderRadius: '60px', marginRight: '24px', background: '#dedede'}}>
            </div>
            <div style={{flex: 1}}>
              <Typography variant='display2' style={{fontSize: '14px', cursor: 'pointer', display: 'inline-block', textDecoration: 'underline', marginTop: '36px'}} onClick={this.props.uploadClicked}>
                Upload a new image
              </Typography>
              <Typography variant="body1" align='justify' style={{fontSize: '14px', marginTop: '12px'}}>
                Maximum size allowed is 1MB of PNG, JPG, JPEG
              </Typography>
            </div>
          </div>

          <Typography variant="display2">
            Personal Info
          </Typography>
          <Typography variant="body2" align='justify' style={{marginTop: '24px', fontWeight:  'bold'}}>
            Email
          </Typography>
          <Typography variant="body1" align='justify' style={{marginTop: '6px'}}>
            {this.props.user.email}

          </Typography>
          <Typography variant="body2" align='justify' style={{marginTop: '24px', fontWeight:  'bold'}}>
            Username
          </Typography>
          <Typography variant="body1" align='justify' style={{marginTop: '6px'}}>
            {this.props.user.username}
          </Typography>
        </Grid>
        <EditEmailModal
          loading={this.props.loading}
          isOpen={this.props.editEmailOpen}
          handleClose={this.props.handleEmailClose}
          handleChange={this.props.handleChange}
          updateClicked={this.props.updateClicked}
          onUpdateKeyDown={this.props.onUpdateKeyDown}
          emailAddress={this.props.emailAddress}
          emailAddressError={this.props.emailAddressError}
          emailAddressErrorMessage={this.props.emailAddressErrorMessage}
          />
      </Grid>
    );
  }
}

/*
<Typography variant='display2' style={{fontSize: '16px', cursor: 'pointer', display: 'inline-block', textDecoration: 'underline', marginLeft: '12px'}} onClick={this.props.editEmail}>
  Edit
</Typography>
*/

export default (Profile);
