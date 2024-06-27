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

