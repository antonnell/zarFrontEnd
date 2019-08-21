import fetch from 'node-fetch';
import config from '../config';

var crypto = require('crypto');
var bip39 = require('bip39');
var sha256 = require('sha256');

let Dispatcher = require('flux').Dispatcher;
let Emitter = require('events').EventEmitter;

let dispatcher = new Dispatcher();
let emitter = new Emitter();
const ERROR = 'error'

let apiUrl = config.assetApiUrl;


class Store {
  constructor() {
    this.registerDispatchers();

    this.store = {
      allAssets: [
        {
          uuid: '0',
          name: 'test',
          symbol: 'TST',
          total_supply: 1000000,
          owner: '0',
          mintable: false,
          ownerBurnable: false,
          holderBurnable: false,
          fromBurnable: false,
          freezable: false,
          icon: null,
        },
        {
          uuid: '1',
          name: 'ZAR Token',
          symbol: 'ZAR',
          total_supply: 1000000000,
          owner: '0',
          mintable: true,
          ownerBurnable: true,
          holderBurnable: false,
          fromBurnable: false,
          freezable: true,
          icon: "data:image/png;base64,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"
        }
      ],
      myAssets: [
        {
          uuid: '0',
          name: 'test',
          symbol: 'TST',
          total_supply: 1000000,
          icon: null
        }
      ]
    }
  }

  registerDispatchers = () => {
    dispatcher.register(
      payload => {
        switch (payload.type) {
          case 'getAssets':
            this.getAssets(payload);
            break;
          case 'issueAsset':
            this.issueAsset(payload);
            break;
          case 'finalizeAsset':
            this.finalizeAsset(payload);
            break;
          case 'getERC20Info':
            this.getERC20Info(payload);
            break;
          default: {
          }
        }
      });
  };

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    return emitter.emit('StoreUpdated');
  };

  getAssets(payload) {
    const url = "api/v1/assets"
    this.callApi(url, 'GET', null, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      this.setStore({ assets: data.result })
      emitter.emit('assets_updated');
    });
  };

  issueAssets(payload) {
    const url = "api/v1/assets"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      if(data.success) {
        emitter.emit('asset_issued', data.result);
      } else if (data.errorMsg) {
        emitter.emit(ERROR, data.errorMsg);
      } else {
        emitter.emit(ERROR, data.result);
      }
    });
  };

  finalizeAsset(payload) {
    const url = "api/v1/finalizeAsset"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      if(data.success) {
        emitter.emit('asset_finalized', data.result);
      } else if (data.errorMsg) {
        emitter.emit(ERROR, data.errorMsg);
      } else {
        emitter.emit(ERROR, data.result);
      }
    });
  };

  getERC20Info(payload) {
    const url = "api/v1/getERC20Info"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      emitter.emit('erc20_info_updated', data.result);
    });
  };

  callApi = function (url, method, postData, payload) {
    let authOTP = '';
    if (payload.authOTP != null) {
      authOTP = payload.authOTP;
    } else {
      const userString = sessionStorage.getItem('cc_user');
      if (userString) {
        const user = JSON.parse(userString);
        authOTP = user.authOTP;
      }
    }

    const call = apiUrl + url;

    if (method === 'GET') {
      postData = null;
    } else {
      const signJson = JSON.stringify(postData);
      const signMnemonic = bip39.generateMnemonic();
      const cipher = crypto.createCipher('aes-256-cbc', signMnemonic);
      const signEncrypted =
        cipher.update(signJson, 'utf8', 'base64') + cipher.final('base64');
      const signData = {
        e: signEncrypted.hexEncode(),
        m: signMnemonic.hexEncode(),
        u: sha256(url.toLowerCase()),
        p: sha256(sha256(url.toLowerCase())),
        t: new Date().getTime()
      };
      const signSeed = JSON.stringify(signData);
      signData.s = sha256(signSeed);
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
        emitter.emit(payload.type, null, res);
      })
      .catch(error => {
        emitter.emit(payload.type, error, null);
      });
  };
}

/* eslint-disable */
String.prototype.hexEncode = function () {
  let hex, i;
  let result = '';
  for (i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }
  return result;
};
String.prototype.hexDecode = function () {
  let j;
  const hexes = this.match(/.{1,4}/g) || [];
  let back = '';
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
};

/* eslint-enable */

const store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
