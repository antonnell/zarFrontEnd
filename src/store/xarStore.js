import fetch from 'node-fetch';
import config from "../config";
// import async from "async";
import {
  POST,
  LOGIN,
  REGISTER,
  GET_ACCOUNTS,
  CREATE_ACCOUNT,
  GET_BENEFICIARIES,
  CREATE_BENEFICIARY,
  GET_TRANSACTIONS,
  PAY,
  GET_ASSETS,
  ISSUE_ASSET,
  MINT_ASSET,
  BURN_ASSET,
  UPLOAD_ASSET_IMAGE,
  SAVINGS_WITHDRAW,
  SAVINGS_DEPOSIT,
  GET_NATIVE_DENOMS,
  GET_CSDT,
  CREATE_CSDT,
  DEPOSIT_CSDT,
  WITHDRAW_CSDT,
  GENERATE_CSDT,
  PAYBACK_CSDT,
  GET_CSDT_PRICES,
  UNAUTHORISED,
  _RETURNED,
  STORE_UPDATED
} from '../constants'
const crypto = require('crypto')
const sha256 = require('sha256')
const bip39 = require('bip39')

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

export const dispatcher = new Dispatcher();
export const emitter = new Emitter();

const apiUrl = config.apiUrl;

class Store {
  constructor() {
    this.store = {
      user: {},
      accounts: [],
      beneficiaries: [],
      bank_accounts: [],
      bank_account_types: [],
      transactions: [],
      allAssets: [],
      myAssets: [],
      csdt: null,
      csdtHistory: [],
      nativeDenoms: [],
      csdtPrices: []
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case LOGIN:
          case REGISTER:
            this.callBasic(payload);
            break;
          case GET_ACCOUNTS:
            this.getAccounts(payload);
            break;
          case CREATE_ACCOUNT:
            this.createAccount(payload);
            break;
          case GET_BENEFICIARIES:
            this.getBeneficiaries(payload);
            break;
          case CREATE_BENEFICIARY:
            this.createBeneficiary(payload);
            break;
          case GET_TRANSACTIONS:
            this.getTransactions(payload);
            break;
          case PAY:
            this.pay(payload)
            break;
          case GET_ASSETS:
            this.getAssets(payload)
            break;
          case ISSUE_ASSET:
            this.issueAsset(payload)
            break;
          case MINT_ASSET:
            this.mintAsset(payload)
            break;
          case BURN_ASSET:
            this.burnAsset(payload)
            break;
          case UPLOAD_ASSET_IMAGE:
            this.uploadAssetImage(payload)
            break;
          case SAVINGS_WITHDRAW:
            this.savingsWithdraw(payload)
            break;
          case SAVINGS_DEPOSIT:
            this.savingsDeposit(payload)
            break;
          case GET_NATIVE_DENOMS:
            this.getNativeDenoms(payload)
            break;
          case GET_CSDT:
            this.getCSDT(payload)
            break;
          case CREATE_CSDT:
            this.createCSDT(payload)
            break;
          case DEPOSIT_CSDT:
            this.depositCSDT(payload)
            break;
          case WITHDRAW_CSDT:
            this.withdrawCSDT(payload)
            break;
          case GENERATE_CSDT:
            this.generateCSDT(payload)
            break;
          case PAYBACK_CSDT:
            this.paybackCSDT(payload)
            break;
          case GET_CSDT_PRICES:
            this.getCSDTPrices(payload)
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    // console.log(obj)
    this.store = {...this.store, ...obj}
    return emitter.emit(STORE_UPDATED);
  };

  callBasic = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  getAccounts = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({accounts: data.result})
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  createAccount = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        const getPayload = {
          type: GET_ACCOUNTS,
          content: {}
        }
        this.getAccounts(getPayload)
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  getBeneficiaries = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({beneficiaries: data.result})
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  createBeneficiary = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err && data.success) {
        const getPayload = {
          type: GET_BENEFICIARIES,
          content: {}
        }
        this.getBeneficiaries(getPayload)
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  getTransactions = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({transactions: data.result})
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  pay = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err && data.success) {
        const getAccountsPayload = {
          type: GET_ACCOUNTS,
          content: {}
        }
        this.getAccounts(getAccountsPayload)

        const getTransactionsPayload = {
          type: GET_TRANSACTIONS,
          content: {}
        }
        this.callBasic(getTransactionsPayload)
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  getAssets = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({ allAssets: data.result })

        const userString = sessionStorage.getItem("xar_user");
        const user = userString !== null ? JSON.parse(userString) : {}; //shouldn't be null

        this.setStore({ myAssets: data.result.filter((ass) => { return ass.user_uuid === user.uuid }) })
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  issueAsset = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        const getPayload = {
          type: GET_ASSETS,
          content: {}
        }
        this.getAssets(getPayload)
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  mintAsset = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        const getPayload = {
          type: GET_ASSETS,
          content: {}
        }
        this.getAssets(getPayload)
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  burnAsset = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        const getPayload = {
          type: GET_ASSETS,
          content: {}
        }
        this.getAssets(getPayload)
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  uploadAssetImage = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        const getPayload = {
          type: GET_ASSETS,
          content: {}
        }
        this.getAssets(getPayload)
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  savingsWithdraw = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        const getAccountsPayload = {
          type: GET_ACCOUNTS,
          content: {}
        }
        this.getAccounts(getAccountsPayload)
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  savingsDeposit = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        const getAccountsPayload = {
          type: GET_ACCOUNTS,
          content: {}
        }
        this.getAccounts(getAccountsPayload)
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  getNativeDenoms = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({ nativeDenoms: data.result })
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  getCSDT = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({ csdt: data.result })
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  createCSDT = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({ csdt: data.result })
      }
      emitter.emit(payload.type+_RETURNED, err, data);

      setTimeout(() => {
        const getCSDTPayload = {
          type: GET_CSDT,
          content: {}
        }
        this.getCSDT(getCSDTPayload)
      }, 5)
    });
  };

  depositCSDT = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({ csdt: data.result })
      }
      emitter.emit(payload.type+_RETURNED, err, data);

      setTimeout(() => {
        const getCSDTPayload = {
          type: GET_CSDT,
          content: {}
        }
        this.getCSDT(getCSDTPayload)
      }, 5)
    });
  };

  withdrawCSDT = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({ csdt: data.result })
      }
      emitter.emit(payload.type+_RETURNED, err, data);

      setTimeout(() => {
        const getCSDTPayload = {
          type: GET_CSDT,
          content: {}
        }
        this.getCSDT(getCSDTPayload)
      }, 5)
    });
  };

  generateCSDT = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({ csdt: data.result })
      }
      emitter.emit(payload.type+_RETURNED, err, data);

      setTimeout(() => {
        const getCSDTPayload = {
          type: GET_CSDT,
          content: {}
        }
        this.getCSDT(getCSDTPayload)
      }, 5)
    });
  };

  paybackCSDT = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({ csdt: data.result })
      }
      emitter.emit(payload.type+_RETURNED, err, data);

      setTimeout(() => {
        const getCSDTPayload = {
          type: GET_CSDT,
          content: {}
        }
        this.getCSDT(getCSDTPayload)
      }, 5)
    });
  };

  getCSDTPrices = (payload) => {
    this.callApi(payload.type, POST, payload.content, payload, (err, data) => {
      if(!err) {
        this.setStore({ csdtPrices: data.result })
      }
      emitter.emit(payload.type+_RETURNED, err, data);
    });
  };

  callApi = function (url, method, postData, payload, callback) {

    const userString = sessionStorage.getItem('xar_user')
    const user = userString !== null ? JSON.parse(userString) : {};

    var call = apiUrl + url;

    if (method === 'GET') {
      postData = null;
    } else {
      const signJson = JSON.stringify(postData);
      const signMnemonic = bip39.generateMnemonic();
      const cipher = crypto.createCipher('aes-256-cbc', signMnemonic);
      const signEncrypted =
        cipher.update(signJson, 'utf8', 'base64') + cipher.final('base64');
      var signData = {
        e: signEncrypted.hexEncode(),
        m: signMnemonic.hexEncode(),
        u: sha256(url.toLowerCase()),
        p: sha256(sha256(url.toLowerCase())),
        t: new Date().getTime()
      };
      const signSeed = JSON.stringify(signData);
      const signSignature = sha256(signSeed);
      signData.s = signSignature;
      postData = JSON.stringify(signData);
    }

    fetch(call, {
      method: method,
      body: postData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + config.apiToken,
        'x-access-token': user.token,
        'x-key': user.tokenKey
      }
    })
      .then(res => {
        if (res.status === 401) {
          return emitter.emit(UNAUTHORISED, null, null);
        }
        if (res.status === 403) {
          return emitter.emit(UNAUTHORISED, null, null);
        }

        if (res.ok || res.status === 400 /*|| res.status === 500*/) {
          return res;
        } else {
          throw Error(res.statusText);
        }
      })
      .then(res => res.json())
      .then(res => {
        callback(null, res)
        // emitter.emit(payload.type, null, res);
      })
      .catch((error) => {
        callback(error, null)
        // emitter.emit(payload.type, error, null);
      });
  };
}

/* eslint-disable */
String.prototype.hexEncode = function () {
  var hex, i;
  var result = '';
  for (i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }
  return result;
};
String.prototype.hexDecode = function () {
  var j;
  var hexes = this.match(/.{1,4}/g) || [];
  var back = '';
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
};
/* eslint-enable */

export const store = new Store();
