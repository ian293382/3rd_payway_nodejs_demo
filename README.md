# 3rd_payway_nodejs_demo
## MVC 架構 -> M ; C -> controller ; V -> view
- (m)business model : 商業邏輯
- (m)data model :


## Database
### Product
- id -primary key
- name var(char255)
- amount (integer unsigned == 100)
- description (text)
- per_order 作為預留金流交易物品 預繳扣費額度
- price 價格
=> 同一時間一堆人點擊 到真正付款時候才扣掉額度


### 訂單表
CREATE TABLE `orders` (
`id` varchar(20) not null primary key COMMENT "大部分API 給予亂數字串",
`total` int unsigned not null default 0, 
`created_at` datetime not null default now(),
`updated_at` datetime not null default now(),
`payment_provider` enum("PAYPAL", "ECPAY"),
`payment_pay` enum("CSV", "CC", "ATM", "PAYPAL"),
`status` enum("WAITING", "SUCCESS", "FAILED", "CANCEL"),
`contents` JSON default null COMMENT "這是商品內容[{商品id,商品數量,商品價格}]"
);

=>enum = enumerate列舉 , enum("T", "E") => 輸入單字不是Ｔ或Ｅ的話他會直接跳錯誤

#### 訂單 - 產品對應表
1. 前端資料驗證 // 使用express-validator
2. 將商品的數量寫入 (預扣) -----> id
3. 利用 ID 去打 第三方金流的 API 來產生給第三方金流的訂單
4. 當使用者付款之後，第三方金流在打我們提供的 update 資訊的 API

//  倉品id, 商品名稱, 商品數量, payment_provider, payment_pay 
// 使用