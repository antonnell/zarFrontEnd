import fetch from 'node-fetch';
import config from "../config";

var crypto = require('crypto');
var bip39 = require('bip39');
var sha256 = require('sha256');

let Dispatcher = require('flux').Dispatcher;
let Emitter = require('events').EventEmitter;

let dispatcher = new Dispatcher();
let emitter = new Emitter();

let apiUrl = config.apiUrl;

class Store {
  constructor() {
    this.store = {
      accounts: null,
      accountsCombined: null
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case 'getAionAddress':
            this.getAionAddress(payload);
            break;
          case 'createAionAddress':
            this.createAionAddress(payload);
            break;
          case 'importAionAddress':
            this.importAionAddress(payload);
            break;
          case 'updateAionAddress':
            this.updateAionAddress(payload);
            break;
          case 'deleteAionAddress':
            this.deleteAionAddress(payload);
            break;
          case 'sendAion':
            this.sendAion(payload);
            break;
          case 'exportAionKey':
            this.exportAionKey(payload);
            break;
          case 'getAionTransactionHistory':
            this.getAionTransactionHistory(payload);
            break;
          default: {
          }
        }
      }.bind(this)
    );
  };

  //GETTER AND SETTER FOR CURRENT STORE DATA
  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    return emitter.emit('StoreUpdated');
  };

  getAionAddress = function (payload) {
    var url = 'aion/getUserAddresses/' + payload.content.id;

    this.callApi(url, 'GET', null, payload, (err, data) => {
      if(err) {
        emitter.emit('error', err)
        emitter.emit('accountsUpdated')
        return
      }

      if(data && data.success) {
        this.setStore({accounts: data.aionAddresses})

        let accountsCombined = data.aionAddresses.reduce((total, currentVal) => {

          total.balance = total.balance + currentVal.balance
          total.usdBalance = total.usdBalance + currentVal.usdBalance

          return total
        }, {
          balance: 0,
          usdBalance: 0,
          type: 'Aion',
          name: 'Aion',
          symbol: 'Aion'
        })

        this.setStore({accountsCombined: [accountsCombined]})

        emitter.emit('accountsUpdated');
      } else {
        emitter.emit('error', data.errorMsg)
        emitter.emit('accountsUpdated')
      }
    });
  };

  createAionAddress = function (payload) {
    var url = 'aion/createAddress';
    var postJson = {
      username: payload.content.username,
      isPrimary: payload.content.isPrimary,
      name: payload.content.name
    };

    this.callApi(url, 'POST', postJson, payload, (err, data) => {
      this.getAionAddress(payload)
    });
  };

  importAionAddress = function (payload) {
    var url = 'aion/importAddress';
    var postJson = {
      name: payload.content.name,
      isPrimary: payload.content.isPrimary,
      address: payload.content.publicAddress,
      privateKey: payload.content.privateKey
    };

    this.callApi(url, 'POST', postJson, payload, (err, data) => {
      this.getAionAddress(payload)
    });
  };

  updateAionAddress = function (payload) {
    var url = 'aion/updateAddress';
    var postJson = {
      name: payload.content.name,
      isPrimary: payload.content.isPrimary,
      address: payload.content.address
    };

    this.callApi(url, 'POST', postJson, payload, (err, data) => {
      payload.content.id = payload.content.userId
      this.getAionAddress(payload)
    });
  };

  deleteAionAddress = function (payload) {
    var url = 'aion/deleteAddress';
    var postJson = {
      address: payload.content.address
    };

    this.callApi(url, 'POST', postJson, payload, (err, data) => {
      payload.content.id = payload.content.userId
      this.getAionAddress(payload)
    });
  };

  sendAion = function (payload) {
    var url = 'aion/sendAion';
    var postJson = {
      fromAddress: payload.content.fromAddress,
      amount: payload.content.amount,
      gwei: payload.content.gwei
    };
    if (payload.content.toAddress != null) {
      postJson.toAddress = payload.content.toAddress;
    }
    if (payload.content.contactUserName != null) {
      postJson.contactUsername = payload.content.contactUserName;
    }

    this.callApi(url, 'POST', postJson, payload, (err, data) => {
      if(err) {
        emitter.emit('error', err)
        return
      }
      emitter.emit('sendReturned', err, data);
    });
  };

  exportAionKey = function (payload) {
    var url = 'aion/exportAddress';
    var postJson = {
      address: payload.content.address,
      mnemonic: payload.content.mnemonic
    };

    this.callApi(url, 'POST', postJson, payload, (err, data) => {
      emitter.emit(payload.type, err, data);
    });
  };

  getAionTransactionHistory = function (payload) {
    var url = 'aion/getTransactionHistory/' + payload.content.id;

    this.callApi(url, 'GET', null, payload, (err, data) => {
      if(data) {
        this.setStore({ transactions: data.transactions });
        emitter.emit('transactionsUpdated');
      }
    });
  };

  callApi = function (url, method, postData, payload, callback) {
    //get X-curve-OTP from sessionStorage
    var userString = sessionStorage.getItem('cc_user');
    var authOTP = '';
    if (userString) {
      var user = JSON.parse(userString);
      authOTP = user.authOTP;
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
        Authorization: 'Bearer ' + payload.token,
        'X-curve-OTP': authOTP
      }
    })
      .then(res => {
        if (res.status === 401) {
          return emitter.emit('Unauthorised', null, null);
        }
        if (res.status === 403) {
          return emitter.emit('Unauthorised', null, null);
        }

        if (res.ok) {
          return res;
        } else {
          throw Error(res.statusText);
        }
      })
      .then(res => res.json())
      .then(res => {
        callback(null, res);
      })
      .catch(error => {
        callback(error, null);
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
var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
