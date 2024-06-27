import { IOrderModel, OrderContent, PaymentProvider, PaymentWay } from "@/model/order";
import { IProductModel } from "@/model/products";
import { NextFunction, Request, Response } from "express";
import { Knex } from "knex";



// order 除了Model 做完CRUD後還需要控制他 1. 創建訂單 2.updatedAmount 第三方金流 所以會交由路由去觸發 res req 同理從knex參數複製
// 然後這些東西會有其他函式運作玩render 回來 本身只需要帶輸入參數包裝 不回傳東西Void
// 這些接頭方法會使用 export class OrderController 去做邏輯運算 只要把參數和方法寫道IOrderController即可

interface CreateOrderRequestParams {
    paymentProvider: PaymentProvider,
    paymentWay: PaymentWay,
    contents: OrderContent[];
    // client .....
}

export interface IOrderController {
    createdOrder(
        req: Request<any, any,  CreateOrderRequestParams, any>,
        res: Response,
        next: NextFunction
    ): void

    updateAmount(
        req: Request<any, any, any, any>,
        res: Response,
        next: NextFunction):void
}

export class OrderController implements IOrderController {
    // 使用private
    knexSql: Knex;
    orderModel: IOrderModel;
    productModel: IProductModel;

    // 要實作方法要先 constructor 如果前面有參數要處理就不會先寫constructor
    // 這個物件需要 transaction function => Knex  要從app當中調用要給他一個接口 (參數)
    // orderModel, productModel => 建立訂單 刷新商品
    constructor( {knexSql, orderModel, productModel}:{
        knexSql: Knex;
        orderModel: IOrderModel;
        productModel: IProductModel;
    } ) {
        // 快速存入變數
        this.knexSql = knexSql;
        this.orderModel = orderModel;
        this.productModel = productModel;
    }
    // 要接IOrderController話吃路的大餅在這邊實作
    // 只要從前端拿到商品id 數量  payment_provider payment_way 其他從後端拿 這幾個為req
    public createOder: IOrderController['createdOrder'] = (req, res, _next) => {
        // req 記得要寫成JS形狀 content期望是[ {product.id, product.amount ,product.price}]
        // 用鼠標指導req 如果還是any 要上去IOrderController補定義 自己定義參數名稱 i.e:CreateOrderRequestParameter() 並且到最上方寫interface(直接定義)
        let { paymentProvider, paymentWay, contents } = req.body
    }

 }