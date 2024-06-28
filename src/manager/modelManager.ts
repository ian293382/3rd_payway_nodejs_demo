import { IOrderModel, OrderModel } from "@/model/order";
import { IProductModel, ProductModel } from "@/model/products";
import { Knex } from "knex";
// 創建管理層 做model 管理 透過modelManager 加入app.ts 方式來啟用功能
// 線階段再有product做好 而新增功能和 extend 功能是
// IProductModel
export interface ModelContext {
    productModel: IProductModel;
    // 增加完IOrderModel 後下面要補
    orderModel: IOrderModel;
}

export const  modelManager = ( { knexSql }: { knexSql: Knex }): ModelContext => {
    // return 各種model
    const productModel = ProductModel.createModel({ knexSql })
    const orderModel = OrderModel.createModel({ knexSql })
    return { productModel, orderModel }; 

}