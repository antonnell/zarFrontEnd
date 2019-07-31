import React from "react";
import createReactClass from "create-react-class";
import AccountsComponent from "../components/accounts";
import bip39 from "bip39";
import TokenAccounts from '../components/tokenAccounts';

const crypto = require("crypto");

let ethEmitter = require("../store/ethStore.js").default.emitter;
let ethDispatcher = require("../store/ethStore.js").default.dispatcher;
let ethStore = require("../store/ethStore.js").default.store;

let binanceEmitter = require("../store/binanceStore.js").default.emitter;
let binanceDispatcher = require("../store/binanceStore.js").default.dispatcher;
let binanceStore = require("../store/binanceStore.js").default.store;

let Accounts = createReactClass({

  getInitialState() {

    const { user, token } = this.props;
    const content = { id: user.id };

    switch(token) {
      case 'Binance':
      case 'BEP2':
        binanceDispatcher.dispatch({
          type: 'getBinanceTransactionHistory',
          content,
          token: user.token
        });
        break
      case 'Ethereum':
      case 'ERC20':
        ethDispatcher.dispatch({
          type: 'getEthTransactionHistory',
          content,
          token: user.token
        });
        break
      default:
        break
    }

    return {
      error: null,

      ethAccountsCombined: ethStore.getStore('accountsCombined'),
      erc20AccountsCombined: ethStore.getStore('erc20AccountsCombined'),
      binanceAccountsCombined: binanceStore.getStore('accountsCombined'),
      bep2AccountsCombined: binanceStore.getStore('bep2AccountsCombined'),

      ethAccounts: ethStore.getStore('accounts'),
      binanceAccounts: binanceStore.getStore('accounts'),

      ethTransactions: ethStore.getStore('transactions'),
      binanceTransactions: binanceStore.getStore('transactions'),

      ethLoading: true,
      binanceLoading: true,
      tokens: [
        { value: 'Binance', description: 'Binance' },
        { value: 'Ethereum', description: 'Ethereum'},
      ],
      tokenValue: null,
      optionsAccount: null,
      editAccount: null,
      editAddressName: '',
      editAddressNameError: null,
      editAddressNameErrorMessage: '',
      cardLoading: false,
      exportKeyAccount: null,
      deleteAddress: null,
      deleteId: null,
      deleteOpen: false,
      mnemonic: null,
      keyOpen: false,
      currentAccountKey: null,
      currentAccountPhrase: null,
      loadingAccount: null,
      viewOpen: false,
      viewAddress: null,
      viewTokensOpen: false,
      viewTokens: null,
      viewTokensAccount: null,
      viewMode: 'Grid',
      accountTypeValue: null,
      accountTypeError: false,
      accountTypeErrorMessage: '',
    };
  },

  componentWillReceiveProps(props) {

    if(this.props.token !== props.token) {
      const { user } = this.props;
      const content = { id: user.id };

      switch(props.token) {
        case 'Binance':
        case 'BEP2':
          binanceDispatcher.dispatch({
            type: 'getBinanceTransactionHistory',
            content,
            token: user.token
          });
          break
        case 'Bitcoin':
        case 'Ethereum':
        case 'ERC20':
          ethDispatcher.dispatch({
            type: 'getEthTransactionHistory',
            content,
            token: user.token
          });
          break
        default:
          break
      }
    }
  },

  render() {
    switch(this.props.token) {
      case "Binance":
      case "Ethereum":
        return this.renderToken()
      default:
        return this.renderAccounts()
    }
  },

  renderToken() {

    let {
      error,
      createOpen,
      importOpen,
      tokens,
      tokenValue,
      tokenError,
      tokenErrorMessage,
      ethLoading,
      binanceLoading,
      addressName,
      addressNameError,
      addressNameErrorMessage,
      publicAddress,
      publicAddressError,
      publicAddressErrorMessage,
      privateKey,
      privateKeyError,
      privateKeyErrorMessage,
      mnemonicPhrase,
      mnemonicPhraseError,
      mnemonicPhraseErrorMessage,
      binanceAccounts,
      ethAccounts,
      binanceTransactions,
      ethTransactions,
      optionsAccount,
      editAccount,
      editAddressName,
      editAddressNameError,
      editAddressNameErrorMessage,
      cardLoading,
      exportKeyAccount,
      deleteOpen,
      keyOpen,
      currentAccountKey,
      currentAccountPhrase,
      loadingAccount,
      viewOpen,
      viewAddress,
      viewTokens,
      viewTokensOpen,
      viewTokensAccount,
    } = this.state

    let {
      theme,
      user,
      transactClicked,
      size,
      contacts,
      token
    } = this.props

    let accounts = null
    let transactions = null

    switch(token) {
      case "Binance":
        accounts = binanceAccounts
        transactions = binanceTransactions
        break;
      case "Ethereum":
        accounts = ethAccounts
        transactions = ethTransactions
        break;
      default:
        break;
    }

    return (
      <TokenAccounts
        error={ error }
        token={ token }
        accounts={ accounts }
        transactions={ transactions }
        loading={ ethLoading || binanceLoading }
        theme={ theme }
        user={ user }
        transactClicked={ transactClicked }
        contacts={ contacts }
        size={ size }
        createOpen={ createOpen }
        handleCreateOpen={ this.handleCreateOpen }
        handleCreateClose={ this.handleCreateClose }
        importOpen={ importOpen }
        handleImportOpen={ this.handleImportOpen }
        handleImportClose={ this.handleImportClose }
        tokens={ tokens }
        tokenValue={ tokenValue }
        tokenError={ tokenError }
        tokenErrorMessage={ tokenErrorMessage }
        handleChange={ this.handleChange }
        handleSelectChange={ this.handleSelectChange }
        handleCreate={ this.handleCreate }
        handleImport={ this.handleImport }
        addressName={ addressName }
        addressNameError={ addressNameError }
        addressNameErrorMessage={ addressNameErrorMessage }
        publicAddress={ publicAddress }
        publicAddressError={ publicAddressError }
        publicAddressErrorMessage={ publicAddressErrorMessage }
        privateKey={ privateKey }
        privateKeyError={ privateKeyError }
        privateKeyErrorMessage={ privateKeyErrorMessage }
        mnemonicPhrase={ mnemonicPhrase }
        mnemonicPhraseError={ mnemonicPhraseError }
        mnemonicPhraseErrorMessage={ mnemonicPhraseErrorMessage }
        optionsClicked={ this.optionsClicked }
        optionsClosed={ this.optionsClosed }
        optionsAccount={ optionsAccount }
        editNameClicked={ this.editNameClicked }
        onEditAddressNameKeyDown={ this.onEditAddressNameKeyDown }
        editAddressName={ editAddressName }
        editAddressNameError={ editAddressNameError }
        editAddressNameErrorMessage={ editAddressNameErrorMessage }
        updatePrimaryClicked={ this.updatePrimaryClicked }
        exportKeyClicked={ this.exportKeyClicked }
        deleteClicked={ this.deleteClicked }
        deleteOpen={ deleteOpen }
        confirmDelete={ this.confirmDelete }
        handleDeleteClose={ this.handleDeleteClose }
        editAccount={ editAccount }
        cardLoading={ cardLoading }
        exportKeyAccount={ exportKeyAccount }
        keyOpen={ keyOpen }
        currentAccountKey={ currentAccountKey }
        currentAccountPhrase={ currentAccountPhrase }
        handleKeyClose={ this.handleKeyClose }
        copyKey={ this.copyKey }
        copyPhrase={ this.copyPhrase }
        loadingAccount={ loadingAccount }
        viewOpen={ viewOpen }
        viewAddress={ viewAddress }
        handleViewClose={ this.handleViewClose }
        handleViewTokens={ this.handleViewTokens }
        viewTokensClose={ this.viewTokensClose }
        viewTokensOpen={ viewTokensOpen }
        viewTokens={ viewTokens }
        viewTokensAccount={ viewTokensAccount }
      />
    );
  },

  renderAccounts() {
    let {
      theme,
      transactClicked,
      transactClosed,
      transactOpen,
      user
    } = this.props

    let {
      error,
      ethAccountsCombined,
      binanceAccountsCombined,
      erc20AccountsCombined,
      bep2AccountsCombined,
      ethLoading,
      binanceLoading,
      createOpen,
      importOpen,
      tokens,
      tokenValue,
      tokenError,
      tokenErrorMessage,
      addressName,
      addressNameError,
      addressNameErrorMessage,
      publicAddress,
      publicAddressError,
      publicAddressErrorMessage,
      privateKey,
      privateKeyError,
      privateKeyErrorMessage,
      mnemonicPhrase,
      mnemonicPhraseError,
      mnemonicPhraseErrorMessage,
      viewMode
    } = this.state

    let accounts = [
      ...(binanceAccountsCombined != null ? binanceAccountsCombined : []),
      ...(bep2AccountsCombined != null ? bep2AccountsCombined : []),
      ...(ethAccountsCombined != null ? ethAccountsCombined : []),
      ...(erc20AccountsCombined != null ? erc20AccountsCombined : []),
    ]

    return (
      <AccountsComponent
        error={ error }
        user={ user }
        theme={ theme }
        accounts={ accounts }
        loading={ ethLoading || binanceLoading }
        transactClicked= { transactClicked }
        transactOpen={ transactOpen }
        transactClosed={ transactClosed }
        createOpen={ createOpen }
        handleCreateOpen={ this.handleCreateOpen }
        handleCreateClose={ this.handleCreateClose }
        importOpen={ importOpen }
        handleImportOpen={ this.handleImportOpen }
        handleImportClose={ this.handleImportClose }
        tokens={ tokens }
        tokenValue={ tokenValue }
        tokenError={ tokenError }
        tokenErrorMessage={ tokenErrorMessage }
        handleChange={ this.handleChange }
        handleSelectChange={ this.handleSelectChange }
        handleCreate={ this.handleCreate }
        handleImport={ this.handleImport }
        addressName={ addressName }
        addressNameError={ addressNameError }
        addressNameErrorMessage={ addressNameErrorMessage }
        publicAddress={ publicAddress }
        publicAddressError={ publicAddressError }
        publicAddressErrorMessage={ publicAddressErrorMessage }
        privateKey={ privateKey }
        privateKeyError={ privateKeyError }
        privateKeyErrorMessage={ privateKeyErrorMessage }
        mnemonicPhrase={ mnemonicPhrase }
        mnemonicPhraseError={ mnemonicPhraseError }
        mnemonicPhraseErrorMessage={ mnemonicPhraseErrorMessage }
        toggleViewClicked={ this.toggleViewClicked }
        viewMode={ viewMode }
      />
    );
  },

  componentWillMount() {
    binanceEmitter.removeAllListeners('accountsUpdated');
    binanceEmitter.removeAllListeners("transactionsUpdated");
    binanceEmitter.removeAllListeners('error');
    binanceEmitter.removeAllListeners('exportBinanceKey');
    binanceEmitter.removeAllListeners('bep2AccountsUpdated');
    binanceEmitter.on('accountsUpdated', this.binanceAccountsRefreshed);
    binanceEmitter.on("transactionsUpdated", this.binanceTransactionsUpdated);
    binanceEmitter.on("error", this.showError);
    binanceEmitter.on("exportBinanceKey", this.exportKeyReturned);
    binanceEmitter.on("bep2AccountsUpdated", this.bep2AccountsUpdated);

    ethEmitter.removeAllListeners('accountsUpdated');
    ethEmitter.removeAllListeners("transactionsUpdated");
    ethEmitter.removeAllListeners('error');
    ethEmitter.removeAllListeners('exportEthereumKey');
    ethEmitter.removeAllListeners('erc20AccountsUpdated');
    ethEmitter.on('accountsUpdated', this.ethAccountsRefreshed);
    ethEmitter.on("transactionsUpdated", this.ethTransactionsUpdated);
    ethEmitter.on("erc20AccountsUpdated", this.erc20AccountsUpdated);
    ethEmitter.on("error", this.showError);
    ethEmitter.on("exportEthereumKey", this.exportKeyReturned);

  },

  showError(error) {
    this.setState({ error: error.toString() })
  },

  exportKeyReturned(error, data) {
    this.setState({ cardLoading: false, exportKeyAccount: null });
    if (error) {
      return this.setState({ error: error.toString() });
    }

    if (data.success) {
      const mnemonic = this.state.mnemonic;

      const encodedKeyHex = data.encryptedPrivateKey;
      const encodedKey = encodedKeyHex.hexDecode();
      let privateKey = decrypt(encodedKey, mnemonic);
      let phrase = null;

      if(data.encryptedPhrase) {
        const encodedPhraseHex = data.encryptedPhrase;
        const encodedPhrase = encodedPhraseHex.hexDecode();
        phrase = decrypt(encodedPhrase, mnemonic);
      }

      this.setState({ keyOpen: true, currentAccountKey: privateKey, currentAccountPhrase: phrase });

    } else if (data.errorMsg) {
      this.setState({ error: data.errorMsg });
    } else {
      this.setState({ error: data.statusText });
    }
  },

  binanceTransactionsUpdated() {
    this.setState({ binanceTransactions: binanceStore.getStore('transactions') })
  },

  ethTransactionsUpdated() {
    this.setState({ ethTransactions: ethStore.getStore('transactions') })
  },

  ethAccountsRefreshed() {
    this.setState({
      ethAccounts: ethStore.getStore('accounts'),
      ethAccountsCombined: ethStore.getStore('accountsCombined'),
      ethLoading: false,
      loadingAccount: null,
      cardLoading: false,
      deleteOpen: false,
      editAccount: null,
      editAddressName: null,
    })
  },

  erc20AccountsUpdated() {
    this.setState({
      erc20AccountsCombined: ethStore.getStore('erc20AccountsCombined'),
    })
  },

  bep2AccountsUpdated() {
    this.setState({
      bep2AccountsCombined: binanceStore.getStore('bep2AccountsCombined')
    })
  },

  binanceAccountsRefreshed() {
    this.setState({
      binanceAccounts: binanceStore.getStore('accounts'),
      binanceAccountsCombined: binanceStore.getStore('accountsCombined'),
      binanceLoading: false,
      loadingAccount: null,
      cardLoading: false,
      deleteOpen: false,
      editAccount: null,
      editAddressName: null,
    })
  },

  handleCreateOpen(tokenValue) {
    this.setState({ createOpen: true, tokenValue })
  },

  handleCreateClose(tokenValue) {
    this.setState({ createOpen: false, tokenValue })
  },

  handleImportOpen(tokenValue) {
    this.setState({ importOpen: true, tokenValue })
  },

  handleImportClose(tokenValue) {
    this.setState({ importOpen: false, tokenValue })
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

  handleChange(event) {
    switch (event.target.name) {
      case 'addressName':
        this.setState({ addressName: event.target.value })
        break;
      case 'publicAddress':
        this.setState({ publicAddress: event.target.value })
        break;
      case 'privateKey':
        this.setState({ privateKey: event.target.value })
        break;
      case 'mnemonicPhrase':
        this.setState({ mnemonicPhrase: event.target.value })
        break;
      case 'editAddressName':
        this.setState({ editAddressName: event.target.value })
        break;
      default:
        break;
    }
  },

  onCreateImportKeyDown(event) {
    if (event.which === 13) {
      if (this.state.createOpen === true) {
        this.handleCreate();
      } else {
        this.handleImport();
      }
    }
  },

  validateCreate() {
    this.setState({ addressNameError: false, addressNameErrorMessage: "", tokenValueError: false, tokenValueErrorMessage: ""})

    const {
      addressName,
      tokenValue
    } = this.state

    let error = false

    if(addressName === null || addressName === "") {
      this.setState({ addressNameError: true, addressNameErrorMessage: 'Address Name is required' })
      error = true
    }

    if(tokenValue === null || tokenValue === "") {
      this.setState({ tokenValueError: true, tokenValueErrorMessage: 'Token is required' })
      error = true
    }

    return !error
  },

  handleCreate() {
    if (this.validateCreate()) {

      const {
        addressName,
        tokenValue
      } = this.state

      const { user } = this.props

      const content = {
        username: user.username,
        name: addressName,
        id: user.id
      };

      switch(tokenValue) {
        case 'Binance':
          this.setState({ binanceLoading: true })
          binanceDispatcher.dispatch({
            type: "createBinanceAddress",
            content,
            token: user.token
          });
          break;
        case 'Ethereum':
          this.setState({ ethLoading: true })
          ethDispatcher.dispatch({
            type: "createEthAddress",
            content,
            token: user.token
          });
          break;
        default:
          break;
      }

      this.handleCreateClose()
    }
  },

  validateImport() {
    this.setState({
      addressNameError: false,
      addressNameErrorMessage: "",
      tokenValueError: false,
      tokenValueErrorMessage: "",
      publicAddressError: false,
      publicAddressErrorMessage: "",
      privateKeyError: false,
      privateKeyErrorMessage: "",
      mnemonicPhraseError: false,
      mnemonicPhraseErrorMessage: "",
    })

    const {
      addressName,
      tokenValue,
      publicAddress,
      privateKey,
      mnemonicPhrase
    } = this.state

    let error = false

    if(addressName === null || addressName === "") {
      this.setState({ addressNameError: true, addressNameErrorMessage: 'Address Name is required' })
      error = true
    }

    if(tokenValue === null || tokenValue === "") {
      this.setState({ tokenValueError: true, tokenValueErrorMessage: 'Token is required' })
      error = true
    }

    if(tokenValue !== "Binance") {
      if(publicAddress === null || publicAddress === "") {
        this.setState({ publicAddressError: true, publicAddressErrorMessage: 'Public Address is required' })
        error = true
      }
    }

    if(privateKey === null || privateKey === "") {
      this.setState({ privateKeyError: true, privateKeyErrorMessage: 'Private Key is required' })
      error = true
    }

    if(tokenValue === 'Binance') {
      if(mnemonicPhrase === null || mnemonicPhrase === "") {
        this.setState({ mnemonicPhraseError: true, mnemonicPhraseErrorMessage: 'Mnemonic Phrase is required' })
        error = true
      }
    }

    return !error
  },

  handleImport() {
    if (this.validateImport()) {

      const {
        addressName,
        tokenValue,
        publicAddress,
        privateKey,
        mnemonicPhrase
      } = this.state

      const { user } = this.props

      const content = {
        name: addressName,
        publicAddress: publicAddress,
        privateKey: privateKey,
        mnemonicPhrase: mnemonicPhrase,
        id: user.id
      };

      switch(tokenValue) {
        case 'Binance':
          this.setState({ binanceLoading: true })
          binanceDispatcher.dispatch({
            type: "importBinanceAddress",
            content,
            token: user.token
          });
          break;
        case 'Ethereum':
          this.setState({ ethLoading: true })
          ethDispatcher.dispatch({
            type: "importEthAddress",
            content,
            token: user.token
          });
          break;
        default:
          break;
      }

      this.handleImportClose()
    }
  },

  optionsClicked(event, optionsAccount) {
    optionsAccount.anchorEl = event.currentTarget;
    this.setState({ optionsAccount });
  },

  optionsClosed() {
    this.setState({ optionsAccount: null });
  },

  editNameClicked(editAccount) {
    this.optionsClosed();
    this.setState({ editAccount, editAddressName: editAccount.name });
  },

  onEditAddressNameKeyDown(event, editAccount) {
    if (event.which === 13) {
      this.updateName(editAccount);
    }
  },

  updateName(account) {
    this.setState({ cardLoading: true });

    const { user } = this.props;

    var content = {
      name: this.state.editAddressName,
      isPrimary: account.isPrimary,
      address: account.address != null ? account.address : account.publicAddress,
      id: account.id,
      userId: user.id
    };

    switch(this.props.token) {
      case 'Binance':
        binanceDispatcher.dispatch({
          type: "updateBinanceAddress",
          content,
          token: this.props.user.token
        });
        break;
      case 'Ethereum':
        ethDispatcher.dispatch({
          type: "updateEthAddress",
          content,
          token: this.props.user.token
        });
        break;
      default:
        break;
    }
  },

  updatePrimaryClicked(account) {
    this.optionsClosed();
    this.setState({ loadingAccount: account, cardLoading: true });

    const { user } = this.props;

    var content = {
      name: account.name != null ? account.name : account.displayName,
      isPrimary: true,
      address: account.address != null ? account.address : account.publicAddress,
      id: account.id,
      userId: user.id
    };

    switch(this.props.token) {
      case 'Binance':
        binanceDispatcher.dispatch({
          type: "updateBinanceAddress",
          content,
          token: this.props.user.token
        });
        break;
      case 'Ethereum':
        ethDispatcher.dispatch({
          type: "updateEthAddress",
          content,
          token: this.props.user.token
        });
        break;
      default:
        break;
    }
  },

  exportKeyClicked(address, id) {
    this.optionsClosed();
    this.setState({
      cardLoading: true,
      exportKeyAccount: address != null ? address : id
    });
    var mnemonic = bip39.generateMnemonic();
    this.setState({ mnemonic });
    var content = {
      mnemonic: mnemonic,
      address: address,
      id: id
    };

    switch(this.props.token) {
      case 'Binance':
        binanceDispatcher.dispatch({
          type: "exportBinanceKey",
          content,
          token: this.props.user.token
        });
        break;
      case 'Ethereum':
        ethDispatcher.dispatch({
          type: "exportEthereumKey",
          content,
          token: this.props.user.token
        });
        break;
      default:
        break;
    }
  },

  deleteClicked(address, id) {
    this.optionsClosed()
    this.setState({ deleteAddress: address, deleteId: id, deleteOpen: true });
  },

  confirmDelete() {
    this.setState({ cardLoading: true });

    const { user } = this.props;

    var content = {
      address: this.state.deleteAddress,
      id: this.state.deleteId,
      userId: user.id
    };

    switch(this.props.token) {
      case 'Binance':
        binanceDispatcher.dispatch({
          type: "deleteBinanceAddress",
          content,
          token: this.props.user.token
        });
        break;
      case 'Ethereum':
        ethDispatcher.dispatch({
          type: "deleteEthAddress",
          content,
          token: this.props.user.token
        });
        break;
      default:
        break;
    }
  },

  handleDeleteClose() {
    this.setState({ deleteAddress: null, deleteOpen: false });
  },

  handleKeyClose() {
    this.setState({ keyOpen: false });
  },

  copyPhrase() {
    var elm = document.getElementById("currentAccountPhrase");
    let range;
    // for Internet Explorer

    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(elm);
      range.select();
      document.execCommand("Copy");
    } else if (window.getSelection) {
      // other browsers
      var selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(elm);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("Copy");
    }
  },

  copyKey() {
    var elm = document.getElementById("currentAccountKey");
    let range;
    // for Internet Explorer

    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(elm);
      range.select();
      document.execCommand("Copy");
    } else if (window.getSelection) {
      // other browsers
      var selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(elm);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("Copy");
    }
  },

  handleViewClose() {
    this.setState({ viewOpen: false });
  },

  handleViewTokens(account) {
    this.optionsClosed();
    this.setState({ viewTokensOpen: true, viewTokens: account.tokens, viewTokensAccount: account.address });
  },

  viewTokensClose() {
    this.setState({ viewTokensOpen: false });
  },

  toggleViewClicked() {
    this.setState({ viewMode: this.state.viewMode === 'Grid' ? 'List' : 'Grid'})
  },

});

function decrypt(text, seed) {
  var decipher = crypto.createDecipher("aes-256-cbc", seed);
  var dec = decipher.update(text, "base64", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

export default Accounts;
