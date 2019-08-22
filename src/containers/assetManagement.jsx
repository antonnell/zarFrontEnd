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
      assetOptions: [],
      viewMode: 'Grid',
      issueOpen: false,
      mintOpen: false,

      assetValue: '',
      assetError: false,
      assetErrorMessage: '',


    }
  },

  UNSAFE_componentWillMount() {
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
      assetOptions: assetStore.getStore('myAssets').map((asset) => { return { value: asset.uuid, description: asset.name }; })
    })
  },

  showError(error) {
    this.setState({ error: error.toString() })
  },

  handleChange(event) {
    switch (event.target.name) {
      default:
        let st = {}
        st[event.target.name+'Value'] = event.target.value
        this.setState(st)
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

  mintAssetClicked(asset) {
    console.log(asset.uuid)
    this.setState({ mintOpen: true, assetValue: asset.uuid })
  },

  mintAssetCloseClicked() {
    this.setState({ mintOpen: false, assetValue: '' })
  },

  handleMint() {
    console.log(this.state)
  },

  burnAssetClicked(asset) {
    this.setState({ burnOpen: true, assetValue: asset.uuid })
  },

  burnAssetCloseClicked() {
    this.setState({ burnOpen: false, assetValue: '' })
  },

  handleBurn() {
    console.log(this.state)
  },

  handleSelectChange(event, value) {

    console.log(event.target)

    switch (event.target.name) {
      case 'asset':
        this.setState({ assetValue: event.target.value })
        break;
      case 'mintingAddress':
        this.setState({ mintingAddressValue: event.target.value })
        break;
      case 'burningAddress':
        this.setState({ burningAddressValue: event.target.value })
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
      mintOpen,
      burnOpen,

      assetValue,
      assetOptions,
      assetError,
      assetErrorMessage,

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
    } = this.state

    console.log(assetValue)

    return (
      <AssetManagementComponent
        toggleViewClicked={ this.toggleViewClicked }
        issueAssetClicked={ this.issueAssetClicked }
        issueAssetCloseClicked={ this.issueAssetCloseClicked }
        mintAssetClicked={ this.mintAssetClicked }
        mintAssetCloseClicked={ this.mintAssetCloseClicked }
        burnAssetClicked={ this.burnAssetClicked }
        burnAssetCloseClicked={ this.burnAssetCloseClicked }

        handleChange={ this.handleChange }
        handleSelectChange={ this.handleSelectChange }

        handelIssue={ this.handelIssue }
        handleMint={ this.handleMint }
        handleBurn={ this.handleBurn }

        theme={ theme }
        allAssets={ allAssets }
        myAssets={ myAssets }
        loading={ loading }
        viewMode={ viewMode }
        issueOpen={ issueOpen }
        mintOpen={ mintOpen }
        burnOpen={ burnOpen }

        error={ error }

        assetValue={ assetValue }
        assetOptions={ assetOptions }
        assetError={ assetError }
        assetErrorMessage={ assetErrorMessage }

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
  },

})

export default (Contacts);
