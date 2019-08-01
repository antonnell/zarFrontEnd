import React from 'react'
import AssetManagementComponent from '../components/assetManagement'
const createReactClass = require('create-react-class')


let assetEmitter = require("../store/assetStore.js").default.emitter;
let assetDispatcher = require("../store/assetStore.js").default.dispatcher;
let assetStore = require("../store/assetStore.js").default.store;

let Contacts = createReactClass({
  getInitialState() {
    return {
      loading: false,
      error: false,
      allAssets: null,
      myAssets: null,
      viewMode: 'Grid',
      issueOpen: false
    }
  },

  componentWillMount() {
    assetEmitter.removeAllListeners('assetsUpdated');
    assetEmitter.removeAllListeners('error');

    assetEmitter.on('assetsUpdated', this.assetsUpdated);
    assetEmitter.on("error", this.showError);

    //TODO: replace this with actually calling for the data.
    this.assetsUpdated();
  },

  assetsUpdated() {
    this.setState({
      allAssets: assetStore.getStore('allAssets'),
      myAssets: assetStore.getStore('myAssets'),
    })
  },

  showError(error) {
    this.setState({ error: error.toString() })
  },

  handleChange(event) {
    switch (event.target.name) {
      default:
        break;
    }
  },

  toggleViewClicked() {
    this.setState({ viewMode: this.state.viewMode === 'Grid' ? 'List' : 'Grid'})
  },

  issueAssetClicked() {
    this.setState({ issueOpen: true })
  },

  issueAssetCloseClicked() {
    this.setState({ issueOpen: false })
  },
  handelIssue() {
    console.log(this.state)
  },
  handleSelectChange(event, value) {
    switch (event.target.name) {
      case 'token':
        this.setState({ tokenValue: event.target.value })
        break;
      default:
        break;
    }
  },

  render() {

    const {
      theme
    } = this.props

    const {
      allAssets,
      myAssets,
      loading,
      error,
      viewMode,
      issueOpen,

      assetName,
      assetNameError,
      assetNameErrorMessage,

      symbol,
      symbolError,
      symbolErrorMessage,

      totalSupply,
      totalSupplyError,
      totalSupplyErrorMessage,

      mintable,
      mintableError,
      mintableErrorMessage,

      mintingAddressValue,
      mintingAddressOptions,
      mintingAddressError,
      mintingAddressErrorMessage,
    } = this.state

    return (
      <AssetManagementComponent
        toggleViewClicked={ this.toggleViewClicked }
        issueAssetClicked={ this.issueAssetClicked }
        issueAssetCloseClicked={ this.issueAssetCloseClicked }
        handleChange={ this.handleChange }
        handelIssue={ this.handelIssue }
        handleSelectChange={ this.handleSelectChange }

        theme={ theme }
        allAssets={ allAssets }
        myAssets={ myAssets }
        loading={ loading }
        viewMode={ viewMode }
        issueOpen={ issueOpen }


        error={ error }

        assetName={ assetName }
        assetNameError={ assetNameError }
        assetNameErrorMessage={ assetNameErrorMessage }

        symbol={ symbol }
        symbolError={ symbolError }
        symbolErrorMessage={ symbolErrorMessage }

        totalSupply={ totalSupply }
        totalSupplyError={ totalSupplyError }
        totalSupplyErrorMessage={ totalSupplyErrorMessage }

        mintable={ mintable }
        mintableError={ mintableError }
        mintableErrorMessage={ mintableErrorMessage }

        mintingAddressValue={ mintingAddressValue }
        mintingAddressOptions={ mintingAddressOptions }
        mintingAddressError={ mintingAddressError }
        mintingAddressErrorMessage={ mintingAddressErrorMessage }
      />
    )
  },

})

export default (Contacts);
