import React, { Component } from "react";
import {
  Grid,
  Typography,
  Button,
  IconButton,
  SvgIcon,
  Card
 } from "@material-ui/core";

import Snackbar from './snackbar';
import PageTitle from "./pageTitle";
import Asset from '../containers/asset';
import PageLoader from './pageLoader';
import IssueModal from './issueAssetModal';
import MintModal from './mintAssetModal';
import BurnModal from './burnAssetModal';

import { colors } from '../theme.js'

function ListIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        fill={props.color}
        d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4V14Z"
      />
    </SvgIcon>
  );
}
function GridIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        fill={props.color}
        d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"
      />
    </SvgIcon>
  );
}



class AssetManagement extends Component {
  renderAssets(assets, owner) {
    let {
      theme,
      loading,
      viewMode,
      user,
      mintAssetClicked,
      burnAssetClicked,
      freezeAssetClicked,
      handleUploadClicked
    } = this.props

    if(!assets) {
      return null
    }

    if(assets && assets.length === 0 && loading !== true) {
      return (<Grid item xs={12} align="center" style={{ minHeight: "190px", paddingTop: "100px" }} >
        <Typography variant="h2">
          We couldn't find any assets. You can create an asset by clicking on the Issue button
        </Typography>
      </Grid>)
    }

    return assets.map((asset) => {
      if(viewMode === 'List') {
        return (
          <Grid item xs={12} key={asset.issue_id} style={{ padding: '0px 24px' }}>
            <Asset
              user={ user }
              asset={ asset }
              theme={ theme }
              viewMode={ viewMode }
              mintAssetClicked={ mintAssetClicked }
              burnAssetClicked={ burnAssetClicked }
              freezeAssetClicked={ freezeAssetClicked }
              owner={ owner }
              handleUploadClicked={ handleUploadClicked }
            />
          </Grid>
        )
      } else {
        return (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={asset.issue_id+'_'+asset.name} style={{ padding: '24px' }}>
            <Asset
              user={ user }
              asset={ asset }
              theme={ theme }
              viewMode={ viewMode }
              mintAssetClicked={ mintAssetClicked }
              burnAssetClicked={ burnAssetClicked }
              freezeAssetClicked={ freezeAssetClicked }
              owner={ owner }
              handleUploadClicked={ handleUploadClicked }
            />
          </Grid>
        )
      }
    })
  }

  render() {

    let {
      theme,
      issueAssetClicked,
      loading,
      issueOpen,
      mintOpen,
      burnOpen,
      error,
      toggleViewClicked,
      viewMode,
      allAssets,
      myAssets,
      onImageChange
    } = this.props

    return (
      <Grid container justify="center" alignItems="flex-start" direction="row">
        <Grid
          item
          xs={12}
          align="left"
        >
          <PageTitle theme={theme} root={null} screen={{ display: 'Asset Management', location: 'assetManagement' }} />
        </Grid>
        <Grid item xs={12} align="center">
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            direction="row"
            spacing={0}
            style={theme.custom.sectionTitle}
          >
            <Grid item xs={6} align='left'>
              <div style={theme.custom.inline}>
                <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>My Assets</Typography>
              </div>
              <div style={{ marginLeft: '15px', display: 'inline-block' }}>
                <IconButton
                  color="primary"
                  aria-label="Switch View"
                  onClick={e => {
                    toggleViewClicked();
                  }}
                >
                  <GridIcon theme={theme} color={viewMode==='Grid'?colors.lightBlue:colors.darkGray} />
                  <ListIcon theme={theme} color={viewMode==='List'?colors.lightBlue:colors.darkGray} />
                </IconButton>
              </div>
            </Grid>
            <Grid item xs={6} align='right'>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={ issueAssetClicked }
              >
                Issue
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            direction="row"
            style={theme.custom.accountsContainer}
          >
            { viewMode === 'List' && this.renderHeader()}
            {this.renderAssets(myAssets, true)}
          </Grid>
        </Grid>

        <Grid item xs={12} align="center">
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            direction="row"
            spacing={0}
            style={theme.custom.sectionTitle}
          >
            <Grid item xs={12} align='left'>
              <Typography variant='h2' align='left' style={{ lineHeight: '37px' }}>All Assets</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            direction="row"
            style={theme.custom.accountsContainer}
          >
            { viewMode === 'List' && this.renderHeader()}
            {this.renderAssets(allAssets, false)}
          </Grid>
        </Grid>
        { loading && this.renderLoader() }
        { error && <Snackbar open={true} type={'Error'} message={error} /> }
        { issueOpen && this.renderIssueModal() }
        { mintOpen && this.renderMintModal() }
        { burnOpen && this.renderBurnModal() }
        <input type="file" id="imgupload" ref="imgupload" style={{display:'none'}} accept="image/x-png,image/jpg,image/jpeg" onChange={onImageChange} />
      </Grid>
    );
  }

  renderHeader() {
    let headerStyle = {
      padding: '17px 24px',
      backgroundColor: '#2f3031'
    }
    let textStyle = {
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600'
    }

    return (<Grid item xs={12} align='left' style={{ padding: '0px 24px' }}>
      <Card style={{borderRadius: '3px'}}>
        <Grid container>
          <Grid item xs={4} align='left' style={headerStyle}>
            <Typography variant="body1" style={textStyle}>
              Name
            </Typography>
          </Grid>
          <Grid item xs={2} align='right' style={headerStyle}>
            <Typography variant="body1" style={textStyle}>
              Total Supply
            </Typography>
          </Grid>
          <Grid item xs={6} align='right' style={headerStyle}>
            <Typography variant="body1" style={textStyle}>
              Actions
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>)
  }

  renderLoader() {
    return <PageLoader />
  }

  renderIssueModal() {

    const {
      issueAssetCloseClicked,
      handleChange,
      handleIssue,
      handleSelectChange,
      handleCheckboxChange,

      issueOpen,
      error,
      loading,

      assetNameValue,
      assetNameError,
      assetNameErrorMessage,

      symbolValue,
      symbolError,
      symbolErrorMessage,

      totalSupplyValue,
      totalSupplyError,
      totalSupplyErrorMessage,

      mintableValue,
      mintableError,
      mintableErrorMessage,

      mintingAddressValue,
      mintingAddressOptions,
      mintingAddressError,
      mintingAddressErrorMessage,
    } = this.props

    return (
      <IssueModal

        handleClose={ issueAssetCloseClicked }
        handleChange={ handleChange }
        handleIssue={ handleIssue }
        handleSelectChange={ handleSelectChange }
        handleCheckboxChange={ handleCheckboxChange }

        isOpen={ issueOpen }
        error={ error }
        loading={ loading }

        assetNameValue={ assetNameValue }
        assetNameError={ assetNameError }
        assetNameErrorMessage={ assetNameErrorMessage }

        symbolValue={ symbolValue }
        symbolError={ symbolError }
        symbolErrorMessage={ symbolErrorMessage }

        totalSupplyValue={ totalSupplyValue }
        totalSupplyError={ totalSupplyError }
        totalSupplyErrorMessage={ totalSupplyErrorMessage }

        mintableValue={ mintableValue }
        mintableError={ mintableError }
        mintableErrorMessage={ mintableErrorMessage }

        mintingAddressValue={ mintingAddressValue }
        mintingAddressOptions={ mintingAddressOptions }
        mintingAddressError={ mintingAddressError }
        mintingAddressErrorMessage={ mintingAddressErrorMessage }
      />
    )
  }

  renderMintModal() {

    const {
      mintAssetCloseClicked,
      handleChange,
      handleMint,
      handleSelectChange,

      mintOpen,
      error,
      loading,

      assetValue,
      assetOptions,
      assetError,
      assetErrorMessage,

      mintAmountValue,
      mintAmountError,
      mintAmountErrorMessage,

      mintingAddressValue,
      mintingAddressOptions,
      mintingAddressError,
      mintingAddressErrorMessage,

      typeValue,
      typeOptions,
      typeError,
      typeErrorMessage,

      beneficiaryValue,
      beneficiaryOptions,
      beneficiaryError,
      beneficiaryErrorMessage,

      ownValue,
      ownOptions,
      ownError,
      ownErrorMessage,

      publicValue,
      publicError,
      publicErrorMessage,
    } = this.props

    return (
      <MintModal

        handleClose={ mintAssetCloseClicked }
        handleChange={ handleChange }
        handleMint={ handleMint }
        handleSelectChange={ handleSelectChange }

        isOpen={ mintOpen }
        error={ error }
        loading={ loading }

        assetValue={ assetValue }
        assetOptions={ assetOptions }
        assetError={ assetError }
        assetErrorMessage={ assetErrorMessage }

        mintAmountValue={ mintAmountValue }
        mintAmountError={ mintAmountError }
        mintAmountErrorMessage={ mintAmountErrorMessage }

        mintingAddressValue={ mintingAddressValue }
        mintingAddressOptions={ mintingAddressOptions }
        mintingAddressError={ mintingAddressError }
        mintingAddressErrorMessage={ mintingAddressErrorMessage }

        typeValue={ typeValue }
        typeOptions={ typeOptions }
        typeError={ typeError }
        typeErrorMessage={ typeErrorMessage }

        beneficiaryValue={ beneficiaryValue }
        beneficiaryOptions={ beneficiaryOptions }
        beneficiaryError={ beneficiaryError }
        beneficiaryErrorMessage={ beneficiaryErrorMessage }

        ownValue={ ownValue }
        ownOptions={ ownOptions }
        ownError={ ownError }
        ownErrorMessage={ ownErrorMessage }

        publicValue={ publicValue }
        publicError={ publicError }
        publicErrorMessage={ publicErrorMessage }
      />
    )
  }

  renderBurnModal() {

    const {
      burnAssetCloseClicked,
      handleChange,
      handleBurn,
      handleSelectChange,

      burnOpen,
      error,
      loading,

      assetValue,
      assetOptions,
      assetError,
      assetErrorMessage,

      burnAmountValue,
      burnAmountError,
      burnAmountErrorMessage,

      burningAddressValue,
      burningAddressOptions,
      burningAddressError,
      burningAddressErrorMessage,

      recipientAddressValue,
      recipientAddressOptions,
      recipientAddressError,
      recipientAddressErrorMessage,
    } = this.props

    return (
      <BurnModal

        handleClose={ burnAssetCloseClicked }
        handleChange={ handleChange }
        handleBurn={ handleBurn }
        handleSelectChange={ handleSelectChange }

        isOpen={ burnOpen }
        error={ error }
        loading={ loading }

        assetValue={ assetValue }
        assetOptions={ assetOptions }
        assetError={ assetError }
        assetErrorMessage={ assetErrorMessage }

        burnAmountValue={ burnAmountValue }
        burnAmountError={ burnAmountError }
        burnAmountErrorMessage={ burnAmountErrorMessage }

        burningAddressValue={ burningAddressValue }
        burningAddressOptions={ burningAddressOptions }
        burningAddressError={ burningAddressError }
        burningAddressErrorMessage={ burningAddressErrorMessage }

        recipientAddressValue={ recipientAddressValue }
        recipientAddressOptions={ recipientAddressOptions }
        recipientAddressError={ recipientAddressError }
        recipientAddressErrorMessage={ recipientAddressErrorMessage }
      />
    )
  }

}

export default AssetManagement;
