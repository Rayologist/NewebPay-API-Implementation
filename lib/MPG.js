import Cryption from "./cryption.js";
import { MPG_VERSION } from "./versions.js";
import qs from "qs";

class MPG {
  constructor({ hashKey, hashIV }) {
    this.hashKey = hashKey;
    this.hashIV = hashIV;
    this.version = MPG_VERSION;
    this.crypto = new Cryption({ hashKey, hashIV });
  }

  _generateStringToHash(encrypted) {
    return `HashKey=${this.hashKey}&${encrypted}&HashIV=${this.hashIV}`;
  }

  generatePostData(tradeInfo) {
    const { MerchantID } = tradeInfo;
    tradeInfo = qs.stringify(tradeInfo);
    const TradeInfo = this.crypto.encrypt(tradeInfo);
    const withKeyAndIV = this._generateStringToHash(TradeInfo);
    const TradeSha = this.crypto.hashSHA256(withKeyAndIV);
    return {
      MerchantID: MerchantID,
      TradeInfo: TradeInfo,
      TradeSha: TradeSha,
      Version: this.version,
    };
  }
}

export default MPG;
