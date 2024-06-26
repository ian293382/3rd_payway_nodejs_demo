import { ProductController, IProductController } from "@/controller/productController"
import { ModelContext } from "./modelManager"
// 目的只是要接全部controller 匯入 並且配給他們會需要哪些 controller 搭配隔壁的model 然後匯入app.ts

// 跟modelManager 一樣做法 把IProductController 拿出來 這裡命名 Context 
// 就是使用的這些controller會需要哪些model 然後再統一掛載到app.ts
export interface ControllerContext {
    productController: IProductController;
}

export const controllerManager = ({
    modelCtx
}: {
    modelCtx: ModelContext
}): ControllerContext => {
    const productController = ProductController.createController({
        // model需求放這裡
        productModel: modelCtx.productModel,
    })
    // 直接輸出controller

    return {
        productController: productController,
    }
}