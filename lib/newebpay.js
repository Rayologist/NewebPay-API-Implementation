import MPG from "./features/mpg.js";
import QueryTradeInfo from "./features/queryTradeInfo.js";
import qs from "qs";
import { QUERY_TRADE_INFO_VERSION, MPG_VERSION } from "./constants/versions.js";

class NewebPay {
  constructor(merchant) {
    const { hashKey, hashIV, isProduction, MerchantID } = merchant;
    this.merchantID = MerchantID
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

  generateQueryInfo(MerchantOrderNo, Amt, RespondType = "JSON") {
    return {
      MerchantID: this.merchantID,
      Version: QUERY_TRADE_INFO_VERSION,
      RespondType: RespondType,
      CheckValue: "",
      TimeStamp: Date.now(),
      MerchantOrderNo: MerchantOrderNo,
      Amt: parseInt(Amt),
    };
  }

  generateTradeInfo(
    {
      MerchantOrderNo,
      Amt,
      ItemDesc,
      Email,
      ReturnURL,
      NotifyURL,
      ClientBackURL,
    },
    RespondType = "JSON"
  ) {
    return {
      MerchantID: this.merchantID,
      RespondType: RespondType,
      TimeStamp: Date.now(),
      Version: MPG_VERSION,
      MerchantOrderNo: MerchantOrderNo,
      Amt: Amt,
      ItemDesc: ItemDesc,
      Email: Email,
      ReturnURL: ReturnURL,
      NotifyURL: NotifyURL,
      ClientBackURL: ClientBackURL,
    };
  }
}

export default NewebPay;
