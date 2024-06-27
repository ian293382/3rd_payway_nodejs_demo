import { Base, IBase } from "./base"
import { Knex } from "knex"
// 從Base 繼承之後 裡面泛型要寫入<Order>的資料型態 但在這之前要建立 同Product方式
// 1. Order在 Knex的資料型態 
export enum PaymentProvider {
    Paypal = 'Paypal',
    ECPAY = 'ECPAY',
}

export enum PaymentWay {
    CVS = "CVS",
    PAYPAL = "PAYPAL",
}

export enum OrderStatus {
    WAITING = "WAITING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    CANCEL = "CANCEL",

}

// json 格式
export interface OrderContent {
    productId: number;
    amount: number;
    price: number;
}

export interface Order {
    id: string;
    total: number;
    created_at: Date;
    updated_at: Date;
    // enum 是要額外建立的方法去儲存
    payment_provider:  PaymentProvider;
    payment_way: PaymentWay;
    status:  OrderStatus;
    contents: OrderContent[]; //json
}

//插入要實作（完全定義 IOrderModel) 需要其他功能寫這邊 本身就CRUD 還需要哪些功能
export interface IOrderModel extends IBase<Order> {
    
}

// 上面資料格式定義完才能帶入 IBase<Order> 就是賦予Order CRUD功能 
// 2.要實作方法了直接 implements 確定要定義了IBase
// 注意資料庫schema 左邊是Knex要處理的 CamelCase 右邊是資料庫要對應的 snakeCase
export class OrderModel extends Base<Order> implements IBase<Order> {
    tableName= "orders";
    schema = {
        id: 'id',
        total: 'total',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paymentProvider: 'payment_provider',
        paymentWay: 'payment_way',
        status: 'status',
        contents: 'contents', 
    };
    // schema做完就直接  1.static createModel 2.constructor
   static createModel= ({
    knexSql,
    tableName,
   }: {
    knexSql: Knex;
    tableName?: string;
   }) => {
    return new OrderModel({ knexSql, tableName });
   };
  
    // 做完static   建立物件 constructor 讓knex資料傳入
    constructor ( { knexSql , tableName }: {
        knexSql: Knex;
        tableName?: string;
    })  {
        super({ knexSql, tableName });
    }
}