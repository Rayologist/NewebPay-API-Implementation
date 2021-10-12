# NewebPay API Implementation

This project implements NewebPay (藍新金流) in Node.js

Packages Used:

- `crypto` (built-in)
- `node-fetch`
- `dotenv`
- `qs`

# Usage

## 1. Download the package

```bash
npm i newebpay-api
```

## 2. Create a .env file

```env
NEWEBPAY_HASH_KEY=your_hash_key
NEWEBPAY_HASH_IV=your_hash_iv

```

## 3. Code Example

### 1. Instantiate NewebPay class

> Set `isProduction` to `false` for using NewebPay testing website

### 1.1 Initialize a merchant object and pass it into `NewebPay`

```node
import NewebPay from "newebpay-api";
import { config } from "dotenv";

config();

const merchant = {
  MerchantID: "YourMerchantID",
  hashKey: process.env.NEWEBPAY_HASH_KEY,
  hashIV: process.env.NEWEBPAY_HASH_IV,
  isProduction: false,
};

const newebpay = new NewebPay(merchant);
```
### 2. Generate Post Data

### 2.1 Generate trade information using `NewebPay.generateTradeInfo`

```node
const tradeInfo = newebpay.generateTradeInfo({
  MerchantOrderNo: "ljwvis_1633936296772",
  Amt: 40400,
  ItemDesc: "IPhone 13 Pro Max 256GB Graphite",
  Email: "customer.email@gmail.com",
  ReturnURL: "",
  NotifyURL: "",
  ClientBackURL: "",
});
```

**Output:**

```node
{
    MerchantID: 'MS323389404',
    RespondType: 'JSON',
    TimeStamp: 1634030621628,
    Version: '1.6',
    MerchantOrderNo: 'ljwvis_1633936296772',
    Amt: 40400,
    ItemDesc: 'IPhone 13 Pro Max 256GB Graphite',
    Email: 'customer.email@gmail.com',
    ReturnURL: '',
    NotifyURL: '',
    ClientBackURL: ''
}
```

### 2.2 Pass tradeInfo into `NewebPay.generatePostData` to Generate POST Data

```node
const postData = newebpay.generatePostData(tradeInfo);
```

**Output:**

```node
{
  URL: 'https://ccore.newebpay.com/MPG/mpg_gateway',
  MerchantID: 'MS323389404',
  TradeInfo: 'e37d5e47d5be4ac5c86f3f2e4c62c92cb60fb318976b41a3a26154d7d3bc69c15eecb522494a3c95b667e93e3b4339254998214886998336e6de787c6fa88e1b8c2f14e1768e604084342364f0af1170daaf8af3fde671b09901e72df4885e9c9decda2856040b1acb5b42b0b48d2b5bab14f3a823d21bd817014b82174718e67662946191fcba7527971d952630748fd6e5cd279628f238c1ca0e2dcfa5267cc922a3c8ddfa994b2e10d7cc96b01eeb59c5d405ccf91f174b1cbbb2155d5a1c675314565c76f1751eafc264aaab2d8d1f4d6ca6fd810c7ed44d60439e9750e5398e5609503fa83adedb616e09b88e77c0f9b44c4e7aee9f2d125d81dc11ee99',
  TradeSha: '5679E8CA307EC67B82060006A5D24FFDB803640548AB6F85465ABCE33FC04CFF',
  Version: '1.6'
}
```

### 3. Server Receiving Payment Infomation from NewebPay

### 3.1 Simple server example and its output

```node
app.post("/payment/confirm/newebpay", (req, res) => {
    const returnMessage = req.body
    console.log(returnMessage)
})

```

**output:**

```node
{
  Status: "SUCCESS",
  MerchantID: "MS323389404",
  Version: "1.6",
  TradeInfo:
    "dea2ece70ce77eaf9c1c8d5dbf3efaa04561be1e542f12e506f90c24010cb53a1d1c0e65d186d94065923e4b7dc6c5a8c054f1cbfab5a5dac2b41d12c50dbfd43b81fa6ce53712bd731b80f705701c2acdeaea06342d6984e507988456626cf1a36b244fdf364943f1e5878cce5224993b1c8a3d53c425b57f06be12a7327feb38516cc7aec442d5c0064c791e7db4f32faad6d2ddd4c8c4b060b4f9b1624cb5f8d6660584b9b93be123a536720641b0c9ac89c996818429070040d8366255ba40ce487f709794330b664dd291c571f0dee4102e82b6592fbd041c6d88be080f69c86238cb3c0e7d38b413957e43559a8bf1b9305619b2568f64524463f84d62dfbe94de5e75a1446447d7a224c3136e295d5c6d9dd487d38e4b8b25cd624fc03c08441652e031937dd0928ca3889f618ee1c9f0de1b3c0e6b97e90cf62726098cea004ae9f48cb6077edb3b2bf16abd78e18d3a4cf30d8921beafa0bcbdf56d69c4a1df8e908ed27651023ca5eb10fd2841e01472ad6f69246070bf8a3ea444aa2161f20f069a524f4257921e860e58f36d0701e4ea18c280df33b69aacd71221ad6be3e2b6d46021548fa2b9dbdb5ac6907f58166e13cf608f569912e06971e69ec826cec95ec7603e8194bea8f050d36f6eab5524b4cda470d2e8c6f37644",
  TradeSha: "BC41CC582C146C798504AE582E1A8335C1E792C62ACBFD82FD4ADB4381BE757A",
}

```

### 3.2 Decrypt the returned message using `NewebPay.decrypt`

```node
const decryptedMessage = newebpay.decrypt(returnMessage);
```

**Output:**

```node
{
  Status: 'SUCCESS',
  Message: '授權成功',
  Result: {
    MerchantID: 'MS323389404',
    Amt: 300,
    TradeNo: '21100714592067778',
    MerchantOrderNo: 'vevzlu_1633589710468',
    RespondType: 'JSON',
    IP: '123.456.789.123',
    EscrowBank: 'HNCB',
    PaymentType: 'CREDIT',
    RespondCode: '00',
    Auth: '755566',
    Card6No: '400022',
    Card4No: '1111',
    Exp: '2603',
    TokenUseStatus: '0',
    InstFirst: 0,
    InstEach: 0,
    Inst: 0,
    ECI: '',
    PayTime: '2021-10-0714:59:20',
    PaymentMethod: 'CREDIT'
  }
}
```

### 4. Confirm trade result by querying trade information

### 4.1 Generate query information using `NewebPay.generateQueryInfo`. The first argument is `MerchantOrderNo` (Order id) and the second, `Amt.` (Amount)

```node
const queryInfo = newebpay.generateQueryInfo("vevzlu_1633589710468", 300);
```

**Output:**

```node
{
  MerchantID: 'MS323389404',
  Version: '1.2',
  RespondType: 'JSON',
  CheckValue: '',
  TimeStamp: 1634032084432,
  MerchantOrderNo: 'vevzlu_1633589710468',
  Amt: 300
}
```

### 4.2 Query trade information using `NewebPay.queryTradeInfo`

```node
const queryResult = await newebpay.queryTradeInfo(queryInfo);
```

**Output:**

```node
{
  Status: 'SUCCESS',
  Message: '查詢成功',
  Result: {
    MerchantID: 'MS323389404',
    Amt: 300,
    TradeNo: '21100714592067778',
    MerchantOrderNo: 'vevzlu_1633589710468',
    TradeStatus: '1',
    PaymentType: 'CREDIT',
    CreateTime: '2021-10-07 14:59:20',
    PayTime: '2021-10-07 14:59:20',
    FundTime: '0000-00-00',
    CheckCode: '824B2BDE75941FE8620F681F8876A6E4175BC36905D2922287A5A7DF79F95283',
    RespondCode: '00',
    Auth: '755566',
    ECI: null,
    CloseAmt: null,
    CloseStatus: '0',
    BackBalance: '300',
    BackStatus: '0',
    RespondMsg: '授權成功',
    Inst: '0',
    InstFirst: '0',
    InstEach: '0',
    PaymentMethod: 'CREDIT',
    Card6No: '400022',
    Card4No: '1111',
    AuthBank: 'KGI'
  }
}
```

## 5. Resources

- [NewebPay API Documentation](https://www.newebpay.com/website/Page/content/download_api)

## 6. Contact

if you have any suggestion or question, please do not hesitate to email me at `rayologist1002@gmail.com`
