
// ProductController 會掛載在router當中會有response  回應可以寫any 
import { IProductModel } from "@/model/products";
import { NextFunction, Request, Response } from "express";
//  
interface ProductControllerProp {
    productModel: IProductModel;
}

// req則是用到express 所以去router -> user.ts看裡面的req 有哪些參數直接貼上 Request<{}, any, any, QueryString.ParsedQs, Record<string, any>> 內部都先Any
export interface IProductController {
    findAll(
        req: Request<any, any, any, any>,
        res: Response,
        _next: NextFunction
    ): void;
}

export class ProductController implements IProductController{
    private productModel: IProductModel;
    //  這個方法要有productModel 屬性 而且必須符合IProductModel的介面 所以 參數這一段可以抽出來 =>interface ProductControllerProp 
    public static createController({ productModel
    }: ProductControllerProp) {
        return new ProductController({productModel});
    }
    constructor({ productModel }:ProductControllerProp) {
        this.productModel = productModel;
    }
    // 因為findAll 建立在res伺服器給出的請求才能用knex去找
    findAll: IProductController['findAll'] = async (_req, res, _next) => {
            const result = await this.productModel.findAll() // 一定要裝await
            res.json(result);
        }
}