import Cryption from "./cryption.js";

class QueryTradeInfo {
  constructor({ hashKey, hashIV, isProduction }) {
    this.hashKey = hashKey;
    this.hashIV = hashIV;
    this.crypto = new Cryption({ hashKey, hashIV });
    this.URL = isProduction
      ? "https://core.newebpay.com/API/QueryTradeInfo"
      : "https://ccore.newebpay.com/API/QueryTradeInfo";
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
    const { MerchantID, Amt, MerchantOrderNo, TradeNo, CheckCode } =
      returnMessage;
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
    const query = { ...queryInfo, CheckValue };
    const response = await fetch(this.URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: qs.stringify(query),
    });
    return await response.json();
  }

  async query(queryInfo) {
    const returnMessage = await this._query(queryInfo);
    if (returnMessage.Result === []) {
      throw new Error(`{Status: ${result.Status}, Message: ${result.Message}}`);
    }
    this._validate(returnMessage.result);
    return returnMessage;
  }
}

export default QueryTradeInfo;
