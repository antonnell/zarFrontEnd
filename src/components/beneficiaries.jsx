import React, { Component } from "react";
import {
  Grid,
  Typography,
  Button,
  Tooltip,
  Card,
  CardContent
} from "@material-ui/core";
import CreateModal from "./createBeneficiaryModal";
import PageTItle from "./pageTitle";
import PageLoader from "./pageLoader";
import Snackbar from './snackbar';

class Beneficiaries extends Component {
  renderBeneficiaries() {
    if (this.props.beneficiaries == null) {
      return (
        <Grid
          item
          xs={12}
          xl={12}
          align="left"
          style={{ minHeight: "190px", position: "relative" }}
        >
          <PageLoader />
        </Grid>
      );
    }

    if (this.props.beneficiaries.length === 0) {
      return (
        <Grid
          item
          xs={12}
          xl={12}
          align="center"
          style={{ minHeight: "190px", paddingTop: "100px" }}
        >
          <Typography variant="h2">
            Oh no, we couldn't find any beneficiaries for you. Why don't you create one?
          </Typography>
        </Grid>
      );
    }

    return this.props.beneficiaries.map(beneficiary => {

      return (
        <Grid item xs={12} lg={6} xl={4} key={beneficiary.uuid} style={{ padding: '24px' }}>
          <Card>
            <CardContent>
              <Grid
                container
                justify="flex-start"
                alignItems="flex-start"
                direction="row"
              >
                <Grid item xs={6} align="left">
                  <Tooltip placement="top-start" title={beneficiary.email_address}>
                    <Typography
                      noWrap
                      variant="h3"
                      style={{ lineHeight: '33px' }}
                    >
                      {beneficiary.name}
                    </Typography>
                  </Tooltip>
                </Grid>
                <Grid item xs={6} align="right">
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={e => {
                      this.props.transactClicked(null, beneficiary.uuid);
                    }}
                  >
                    Pay
                  </Button>
                </Grid>
                <Grid item xs={12} align="left">
                  <Typography
                  variant="subtitle1"
                  color="textSecondary">
                    {beneficiary.reference}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      );
    });
  }

  render() {
    let {
      error,
      theme,
      loading,
      name,
      nameError,
      nameErrorMessage,
      emailAddress,
      emailAddressError,
      emailAddressErrorMessage,
      mobileNumber,
      mobileNumberError,
      mobileNumberErrorMessage,
      reference,
      referenceError,
      referenceErrorMessage,
      walletAddress,
      walletAddressError,
      walletAddressErrorMessage,
      createClicked,
      handleCreateClose,
      createOpen,
      handleChange,
      validateField,
      handleCreateOpen,
      onCreateKeyDown
    } = this.props

    return (
      <Grid
        container
        justify="center"
        alignItems="flex-start"
        direction="row"
        spacing={0}
        style={{ marginTop: "0px" }}
      >
        <Grid
          item
          xs={12}
          align="left"
        >
          <PageTItle theme={theme} root={null} screen={{display: 'Beneficiaries', location: 'beneficiaries'}} />
        </Grid>
        <Grid item xs={12} align="center">
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            direction="row"
            spacing={0}
            style={ theme.custom.sectionTitle }
          >
            <Grid item xs={6} align='left' >
              <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>Beneficiaries</Typography>
            </Grid>
            <Grid item xs={6} align='right' >
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleCreateOpen}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} align="center">
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            direction="row"
            style={ theme.custom.accountsContainer }
          >
            {this.renderBeneficiaries()}
          </Grid>
        </Grid>
        { error && <Snackbar open={ true } type={ 'Error' } message={ error } /> }
        <CreateModal
          isOpen={createOpen}
          handleClose={handleCreateClose}
          createClicked={createClicked}
          onCreateKeyDown={onCreateKeyDown}
          loading={loading}

          name={name}
          nameError={nameError}
          nameErrorMessage={nameErrorMessage}
          emailAddress={emailAddress}
          emailAddressError={emailAddressError}
          emailAddressErrorMessage={emailAddressErrorMessage}
          mobileNumber={mobileNumber}
          mobileNumberError={mobileNumberError}
          mobileNumberErrorMessage={mobileNumberErrorMessage}
          reference={reference}
          referenceError={referenceError}
          referenceErrorMessage={referenceErrorMessage}
          walletAddress={walletAddress}
          walletAddressError={walletAddressError}
          walletAddressErrorMessage={walletAddressErrorMessage}

          handleChange={handleChange}
          validateField={validateField}
        />
      </Grid>
    );
  }
}

export default Beneficiaries;
