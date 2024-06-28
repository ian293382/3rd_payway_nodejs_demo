import { IOrderModel, OrderContent, PaymentProvider, PaymentWay } from "@/model/order";
import { IProductModel } from "@/model/products";
import { NextFunction, Request, Response } from "express";
import { ValidationChain, body, validationResult } from "express-validator";
import { Knex } from "knex";
import { isEmpty } from "lodash";



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
    createOrderValidator(): ValidationChain[],// 去下面看body 會要哪些參數 xxxxx:ValidationChain
    createOrder(
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

    // class 要補上Static 跟 product一樣 static createController
    // 跟product 一樣 createController return new orderController 參數戴上
    public static createController = ({
        knexSql,
        orderModel,
        productModel
    }:{
        knexSql: Knex;
        orderModel: IOrderModel;
        productModel: IProductModel;
        }) =>  {
        return new OrderController({ knexSql,orderModel,productModel })
    }

    // 要實作方法要先 constructor 如果前面有參數要處理就不會先寫constructor
    // 這個物件需要 transaction function => Knex  要從app當中調用要給他一個接口 (參數)
    // orderModel, productModel => 建立訂單 刷新商品
    constructor({ knexSql, orderModel, productModel }:{
        knexSql: Knex;
        orderModel: IOrderModel;
        productModel: IProductModel;
    } ) {
        // 快速存入變數
        this.knexSql = knexSql;
        this.orderModel = orderModel;
        this.productModel = productModel;
    }

    // 驗證就是把資料抓進來不用輸入參數 用 return array []搜集多筆資料 寫厚道跑routes
    public createOrderValidator = () =>{
    
        // 設定參數驗證在之前的方法要有這些內容 
        const paymentProviderValidator = (value: any ) => {
            return [PaymentProvider.ECPAY, PaymentProvider.Paypal].includes(value);
        }
        const paymentWayValidator = (value: any) => {
            return [PaymentWay.CVS, PaymentWay.PAYPAL].includes(value);
        }
        // Content 可以any 或者是 OrderContent[] 使用後者好處 productId直接寫
        const contentsValidator = (value: OrderContent[]) => {
            // 理論上要有資料
            if (isEmpty(value)) false;
            // 抓內部資料就是用for loop
            for (const product of value) {
                if (
                    [product.productId, product.amount, product.price].some(val => !val)
                ) 
                    return false;
            }
            return true;
        };

        return [
            body('paymentProvider', "Invalid payment provider").custom(
                paymentProviderValidator
            ),
            body('paymentPay', "Invalid payment pay").custom(
                paymentWayValidator
            ),
            // contents 比較特別 有三個錯誤
            body('contents', 'Invalid product provider content')
            .isArray()
            .custom(
                contentsValidator
            ),
        ];
    };
    // 要接IOrderController話吃路的大餅在這邊實作
    // 只要從前端拿到商品id 數量  payment_provider payment_way 其他從後端拿 這幾個為req
    public createOrder: IOrderController['createOrder'] = (req, res, _next) => {
        // req 記得要寫成JS形狀 content期望是[ {product.id, product.amount ,product.price}]
        // 用鼠標指導req 如果還是any 要上去IOrderController補定義 自己定義參數名稱 i.e:CreateOrderRequestParameter() 並且到最上方寫interface(直接定義)
        let { paymentProvider, paymentWay, contents } = req.body
        // 先打看看能不能有參數進到這個method 到前台要收到資料mounted 也就是要設計一個router 跑vue mounted
        console.log(paymentProvider, paymentWay,contents);
         // 測試用打api 通過就給他 res.json({'status': 'success'})

        // 1.資料驗證 方法1 自己寫邏輯 / 方法2 線上套件 ===>其一 express validator 1.安裝後 先建立新方法 public method ...
        // https://express-validator.github.io/docs/guides/getting-started => ValidationResult

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array() });
        }
      
        
       
   
        // 2. 將資料入db => order

        // 3. 金流

    };

    public updateAmount: IOrderController["updateAmount"] =(req, res, _next) => {
        // TODO
    }
    

 }