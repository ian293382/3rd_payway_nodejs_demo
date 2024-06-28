// router need Express.js

import { ControllerContext } from '@/manager/controllerManager'
import express from 'express';

export const mountOrderRouter = ({
    controllerCtx
}: {controllerCtx: ControllerContext}) => {
    let router = express.Router(); 
// 跟controllerCtx.productController 寫法一樣發現沒有OrderController 回去controllerCtx
    router.post('/create',
    // 新增 Middleware
    controllerCtx.orderController.createOrderValidator(), // createOrderValidator是函式 要加上（）才會回傳 ValidatorChaon
    controllerCtx.orderController.createOrder);

    return router
} 