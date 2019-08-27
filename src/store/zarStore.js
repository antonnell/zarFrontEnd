import fetch from 'node-fetch';
import config from "../config";
import async from "async";
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
  PAY_RETURNED,
  ERROR,
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
      assets: []
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
    this.store = {...this.store, ...obj}
    return emitter.emit(STORE_UPDATED);
  };

  callBasic = (payload) => {
    console.log(payload)
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

  callApi = function (url, method, postData, payload, callback) {

    let user = {}
    const userString = sessionStorage.getItem('zar_user')
    if(userString) {
      user = JSON.parse(userString)
    }

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

        if (res.ok || res.status === 400) {
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
      .catch((error, a, b) => {
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
