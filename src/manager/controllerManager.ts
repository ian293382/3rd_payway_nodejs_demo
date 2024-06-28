import { ProductController, IProductController } from "@/controller/productController"
import { ModelContext } from "./modelManager"
import { IOrderController, OrderController } from "@/controller/orderController";
import { Knex } from "knex";
// 目的只是要接全部controller 匯入 並且配給他們會需要哪些 controller 搭配隔壁的model 然後匯入app.ts

// 跟modelManager 一樣做法 把IProductController 拿出來 這裡命名 Context 
// 就是使用的這些controller會需要哪些model 然後再統一掛載到app.ts
export interface ControllerContext {
    productController: IProductController;
    orderController: IOrderController;
}


export const controllerManager = ({
    knexSql,
    modelCtx,
}: {
    modelCtx: ModelContext
    knexSql: Knex; // 因為orderController會用到knexSql 
}): ControllerContext => {
    const productController = ProductController.createController({
        // model需求放這裡 就是 product model
        productModel: modelCtx.productModel,
    })
    // 找不到名稱 'OrderController'。您指的是 'orderController' 嗎? OrderController.ts 少寫了static 方法
    const orderController = OrderController.createController({
        // 一樣model需求 order knex product 會發現沒有 orderModel 回到modelCtx補加
        // knex則需要加裝到controllerManager 參數裡面
        knexSql,
        orderModel: modelCtx.orderModel,
        productModel: modelCtx.productModel,
    })

    // 直接輸出controller
    return {
        productController,
        orderController,
    }
}