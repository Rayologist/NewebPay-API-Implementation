import MPG from "./features/mpg.js";
import QueryTradeInfo from "./features/queryTradeInfo.js";
import qs from "qs";

class NewebPay {
  constructor(merchant) {
    this.merchant = merchant;
    const { hashKey, hashIV, isProduction } = merchant;
    this.hashKey = hashKey;
    this.hashIV = hashIV;
    this.isProduction = isProduction;
    this.mpg = new MPG({ hashKey, hashIV, isProduction });
    this.qti = new QueryTradeInfo({ hashKey, hashIV, isProduction });
  }

  generatePostData(tradeInfo) {
    return this.mpg.generatePostData(tradeInfo);
  }

  decrypt(returnMessage, parseQueryString = null) {
    const decryptedMessage = this.mpg.decrypt(returnMessage);
    if (parseQueryString != null) {
      return qs.parse(decryptedMessage);
    }
    return JSON.parse(decryptedMessage);
  }

  async queryTradeInfo(queryInfo) {
    return await this.qti.query(queryInfo);
  }
}

export default NewebPay;
