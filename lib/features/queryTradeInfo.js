import Cryption from '../crypto/cryption.js';
import qs from 'qs';
import fetch from 'node-fetch';

class QueryTradeInfo {
  constructor({ hashKey, hashIV, isProduction }) {
    this.hashKey = hashKey;
    this.hashIV = hashIV;
    this.crypto = new Cryption({ hashKey, hashIV });
    this.URL = isProduction
      ? 'https://core.newebpay.com/API/QueryTradeInfo'
      : 'https://ccore.newebpay.com/API/QueryTradeInfo';
  }

  _generateCheckValue(queryInfo) {
    const { Amt, MerchantID, MerchantOrderNo } = queryInfo;
    const queryString = qs.stringify({
      IV: this.hashIV,
      Amt,
      MerchantID,
      MerchantOrderNo,
      Key: this.hashKey,
    });

    return this.crypto.hashSHA256(queryString);
  }

  _validate(returnMessage) {
    const { MerchantID, Amt, MerchantOrderNo, TradeNo, CheckCode } = returnMessage;
    const queryString = qs.stringify({
      HashIV: this.hashIV,
      Amt,
      MerchantID,
      MerchantOrderNo,
      TradeNo,
      HashKey: this.hashKey,
    });
    this.crypto.validateSHA(queryString, CheckCode);
  }

  async _query(queryInfo) {
    const CheckValue = this._generateCheckValue(queryInfo);
    const UserAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36';
    const query = { ...queryInfo, CheckValue };
    const response = await fetch(this.URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': UserAgent,
      },
      body: qs.stringify(query),
    });

    return response.json();
  }

  async query(queryInfo) {
    const returnMessage = await this._query(queryInfo);
    if (Array.isArray(returnMessage.Result)) {
      return returnMessage;
    }
    this._validate(returnMessage.Result);
    return returnMessage;
  }
}

export default QueryTradeInfo;
