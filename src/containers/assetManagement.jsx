import React from 'react'
import AssetManagementComponent from '../components/assetManagement'
import {
  GET_ASSETS,
  GET_ASSETS_RETURNED,
  ISSUE_ASSET,
  ISSUE_ASSET_RETURNED,
  BURN_ASSET,
  BURN_ASSET_RETURNED,
  MINT_ASSET,
  MINT_ASSET_RETURNED,
  GET_ACCOUNTS,
  GET_ACCOUNTS_RETURNED,
  GET_BENEFICIARIES,
  GET_BENEFICIARIES_RETURNED,
  UPLOAD_ASSET_IMAGE,
  UPLOAD_ASSET_IMAGE_RETURNED,
  ERROR,
} from '../constants'
const createReactClass = require('create-react-class')

const { emitter, dispatcher, store } = require("../store/zarStore.js");

let AssetManagement = createReactClass({
  getInitialState() {
    return {
      loading: true,
      error: false,
      allAssets: null,
      myAssets: null,
      assetOptions: [],
      accountOptions: [],
      viewMode: 'Grid',
      issueOpen: false,
      mintOpen: false,

      assetValue: '',
      assetError: false,
      assetErrorMessage: '',
      typeOptions: [
        {  value: 'beneficiary', description: 'Beneficiary' },
        {  value: 'public', description: 'Public Address' },
        {  value: 'own', description: 'Own Account' },
      ],
      typeValue: 'beneficiary',

    }
  },

  UNSAFE_componentWillMount() {
    emitter.removeListener(GET_ASSETS_RETURNED, this.assetsUpdated);
    emitter.removeListener(GET_ACCOUNTS_RETURNED, this.accountsUpdated);
    emitter.removeListener(GET_BENEFICIARIES_RETURNED, this.beneficiariesUpdated);
    emitter.removeListener(ISSUE_ASSET_RETURNED, this.issueAssetReturned);
    emitter.removeListener(BURN_ASSET_RETURNED, this.burnAssetReturned);
    emitter.removeListener(BURN_ASSET_RETURNED, this.burnAssetReturned);
    emitter.removeListener(UPLOAD_ASSET_IMAGE_RETURNED, this.uploadAssetImageReturned);
    emitter.removeListener(ERROR, this.showError);

    emitter.on(GET_ASSETS_RETURNED, this.assetsUpdated);
    emitter.on(GET_ACCOUNTS_RETURNED, this.accountsUpdated);
    emitter.on(GET_BENEFICIARIES_RETURNED, this.beneficiariesUpdated);
    emitter.on(ISSUE_ASSET_RETURNED, this.issueAssetReturned);
    emitter.on(MINT_ASSET_RETURNED, this.mintAssetReturned);
    emitter.on(BURN_ASSET_RETURNED, this.burnAssetReturned);
    emitter.on(UPLOAD_ASSET_IMAGE_RETURNED, this.uploadAssetImageReturned);
    emitter.on(ERROR, this.showError);

    const content = {};
    dispatcher.dispatch({ type: GET_ASSETS, content })
    dispatcher.dispatch({ type: GET_ACCOUNTS, content });
    dispatcher.dispatch({ type: GET_BENEFICIARIES, content });
  },

  assetsUpdated() {
    this.setState({
      allAssets: store.getStore('allAssets'),
      myAssets: store.getStore('myAssets'),
      assetOptions: store.getStore('myAssets').map((asset) => { return { value: asset.uuid, description: asset.name }; }),
      loading: false
    })
  },

  accountsUpdated() {
    this.setState({
      accounts: store.getStore('accounts'),
      mintingAddressOptions: store.getStore('accounts').map((asset) => { return { value: asset.uuid, description: asset.name }; }),
      burningAddressOptions: store.getStore('accounts').map((asset) => { return { value: asset.uuid, description: asset.name }; })
    })
  },

  beneficiariesUpdated() {
    const beneficiaries = store.getStore('beneficiaries')

    const beneficiaryOptions = beneficiaries ? beneficiaries.map((beneficiary) => {
      return {
        description: beneficiary.name,
        value: beneficiary.uuid
      }
    }) : []

    this.setState({
      beneficiaries: beneficiaries,
      beneficiaryOptions: beneficiaryOptions
    })
  },

  issueAssetReturned(error, data) {

    if(!data && error) {
      this.setState({ loading: false })
      this.showError(error)
      return
    }

    if(!data.success) {
      this.setState({
        loading: false
      })
      this.showError(data.result)
      return
    }

    this.setState({
      issueOpen: false,
      error: null,
      symbol: '',
      name: '',
      totalSupply: '',
      mintingAddress: '',
      mintable: false,
      ownerBurnable: false,
      holderBurnable: false,
      fromBurnable: false,
      freezable: false
    })
  },

  mintAssetReturned(error, data) {
    if(!data && error) {
      this.setState({ loading: false })
      this.showError(error)
      return
    }

    if(!data.success) {
      this.setState({ loading: false })
      this.showError(data.result)
      return
    }

    this.setState({
      mintOpen: false,
      error: null,
      assetValue: '',
      mintAmountValue: '',
      typeValue: 'beneficiary',
      beneficiaryValue: '',
      ownValue: '',
      publicValue: ''
    })
  },

  burnAssetReturned(error, data) {
    if(!data && error) {
      this.setState({ loading: false })
      this.showError(error)
      return
    }

    if(!data.success) {
      this.setState({ loading: false })
      this.showError(data.result)
      return
    }

    this.setState({
      burnOpen: false,
      error: null,
      assetValue: '',
      burnAmountValue: '',
      typeValue: 'beneficiary',
      beneficiaryValue: '',
      ownValue: '',
      publicValue: ''
    })
  },

  uploadAssetImageReturned(error, data) {
    console.log(error)
    console.log(data)

    this.setState({ loading: false })
  },

  showError(error) {
    this.setState({ error: error.toString() })
  },

  handleChange(event) {

    let st = {}
    st[event.target.name+'Value'] = event.target.value

    console.log(st)

    this.setState(st)
  },

  handleCheckboxChange(event, checked) {
    let st = {}
    st[event.target.name+'Value'] = checked
    this.setState(st)
  },

  handleUploadClicked(asset) {
    this.setState({ uploadAsset: asset.uuid })
    document.getElementById("imgupload").click()
  },

  onImageChange(event) {
    event.stopPropagation();

    if(event.target.files && event.target.files.length >= 1) {
      let state = this;

      setTimeout(function() {
        state.setState({ loading: true, error: null });
      }, 1)

      let filename = event.target.files[0].name;
      let extension = filename.substr((filename.lastIndexOf('.') + 1));

      var reader = new FileReader();
      reader.onload = function(){
        // let res = new Uint8Array(this.result).reduce(function (data, byte) {
        //   return data + String.fromCharCode(byte);
        // }, '');

        let res = reader.result
        // var strImage = res.replace(/^data:image\/[a-z]+;base64,/, "");

        var content = {
          image_data: res,
          image_extension: extension,
          asset_uuid: state.state.uploadAsset
        };

        dispatcher.dispatch({ type: UPLOAD_ASSET_IMAGE, content });
      }
      // reader.readAsArrayBuffer(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
    }
  },

  toggleViewClicked() {
    this.setState({ viewMode: this.state.viewMode === 'Grid' ? 'List' : 'Grid'})
  },

  issueAssetClicked() {
    this.setState({ issueOpen: true, error: false })
  },

  issueAssetCloseClicked() {
    this.setState({ issueOpen: false })
  },

  handleIssue() {
    if(this.validateIssueAsset()) {
      const {
        symbolValue,
        assetNameValue,
        totalSupplyValue,
        mintingAddressValue,
        mintableValue,
        ownerBurnableValue,
        holderBurnableValue,
        fromBurnableValue,
        freezableValue
      } = this.state

      const content = {
        symbol: symbolValue,
        name: assetNameValue,
        total_supply:  totalSupplyValue,
        minting_address: mintingAddressValue,
        mintable: mintableValue,
        owner_burnable: ownerBurnableValue,
        holder_burnable: holderBurnableValue,
        from_burnable: fromBurnableValue,
        freezable: freezableValue
      }

      this.setState({ loading: true })
      dispatcher.dispatch({ type: ISSUE_ASSET, content })
    }
  },

  validateIssueAsset() {

    this.setState({
      symbolError: false,
      symbolErrorMessage: '',
      assetNameError: false,
      assetNameErrorMessage: '',
      totalSupplyError: false,
      totalSupplyErrorMessage: '',
      mintingAddressError: false,
      mintingAddressErrorMessage: '',
    })

    const {
      symbolValue,
      assetNameValue,
      totalSupplyValue,
      mintingAddressValue
    } = this.state

    let error = false

    if(!symbolValue) {
      error = true
      this.setState({
        symbolError: false,
        symbolErrorMessage: 'Symbol is required',
      })
    }

    if(!assetNameValue) {
      error = true
      this.setState({
        assetNameError: false,
        assetNameErrorMessage: 'Name is required',
      })
    }

    if(!totalSupplyValue) {
      error = true
      this.setState({
        totalSupplyError: false,
        totalSupplyErrorMessage: 'Total Supply is required'
      })
    }

    if(!mintingAddressValue) {
      error = true
      this.setState({
        mintingAddressError: false,
        mintingAddressErrorMessage: 'Minting Address is required'
      })
    }

    return !error
  },

  mintAssetClicked(asset) {
    this.setState({ mintOpen: true, assetValue: asset.uuid, error: false })
  },

  mintAssetCloseClicked() {
    this.setState({ mintOpen: false, assetValue: '' })
  },

  handleMint() {
    console.log(this.state)

    //add validation
    const {
      assetValue,
      mintAmountValue,
      typeValue,
      beneficiaryValue,
      ownValue,
      publicValue
    } = this.state

    const content = {
      asset_uuid: assetValue,
      amount: mintAmountValue,
      recipient_type: typeValue
    }

    if(typeValue === 'beneficiary') {
      content.beneficiary_uuid = beneficiaryValue
    }

    if(typeValue === 'own') {
      content.own_account_uuid = ownValue
    }

    if(typeValue === 'public') {
      content.address = publicValue
    }

    console.log(content)
    this.setState({ loading: true })
    dispatcher.dispatch({ type: MINT_ASSET, content })
  },

  burnAssetClicked(asset) {
    this.setState({ burnOpen: true, assetValue: asset.uuid, error: false })
  },

  burnAssetCloseClicked() {
    this.setState({ burnOpen: false, assetValue: '' })
  },

  handleBurn() {
    console.log(this.state)

    //add validation
    const {
      assetValue,
      burnAmountValue,
      burningAddressValue
    } = this.state

    const content = {
      asset_uuid: assetValue,
      amount: burnAmountValue,
      recipient_type: 'own',
      own_account_uuid: burningAddressValue,
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: BURN_ASSET, content })
  },

  handleSelectChange(event, value) {
    let st = {}
    st[event.target.name+'Value'] = event.target.value
    this.setState(st)
  },

  render() {

    const {
      theme,
      user
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

      burningAddressValue,
      burningAddressOptions,
      burningAddressError,
      burningAddressErrorMessage,

      typeValue,
      typeOptions,
      typeError,
      typeErrorMessage,

      beneficiaryValue,
      beneficiaryOptions,
      beneficiaryError,
      beneficiaryErrorMessage,

      ownValue,
      ownError,
      ownErrorMessage,

      publicValue,
      publicError,
      publicErrorMessage,
    } = this.state

    return (
      <AssetManagementComponent
        toggleViewClicked={ this.toggleViewClicked }
        issueAssetClicked={ this.issueAssetClicked }
        issueAssetCloseClicked={ this.issueAssetCloseClicked }
        mintAssetClicked={ this.mintAssetClicked }
        mintAssetCloseClicked={ this.mintAssetCloseClicked }
        burnAssetClicked={ this.burnAssetClicked }
        burnAssetCloseClicked={ this.burnAssetCloseClicked }
        freezeAssetClicked={ this.freezeAssetClicked }
        freezeAssetCloseClicked={ this.freezeAssetCloseClicked }

        handleChange={ this.handleChange }
        handleSelectChange={ this.handleSelectChange }
        handleCheckboxChange={ this.handleCheckboxChange }

        handleIssue={ this.handleIssue }
        handleMint={ this.handleMint }
        handleBurn={ this.handleBurn }

        onImageChange={ this.onImageChange }
        handleUploadClicked={ this.handleUploadClicked }

        user={ user }
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

        burningAddressValue={ burningAddressValue }
        burningAddressOptions={ burningAddressOptions }
        burningAddressError={ burningAddressError }
        burningAddressErrorMessage={ burningAddressErrorMessage }

        typeValue={ typeValue }
        typeOptions={ typeOptions }
        typeError={ typeError }
        typeErrorMessage={ typeErrorMessage }

        beneficiaryValue={ beneficiaryValue }
        beneficiaryOptions={ beneficiaryOptions }
        beneficiaryError={ beneficiaryError }
        beneficiaryErrorMessage={ beneficiaryErrorMessage }

        ownValue={ ownValue }
        ownOptions={ mintingAddressOptions }
        ownError={ ownError }
        ownErrorMessage={ ownErrorMessage }

        publicValue={ publicValue }
        publicError={ publicError }
        publicErrorMessage={ publicErrorMessage }
      />
    )
  },

})

export default (AssetManagement);
