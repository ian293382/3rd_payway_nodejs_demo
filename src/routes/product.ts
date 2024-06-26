import express from 'express';
import { ControllerContext } from '@/manager/controllerManager';


// 做unit testing 比較方便 router 裡面會需要Controller return router 後去 app.ts掛載
export const mountProductRouter = ({
    controllerCtx}:{
        controllerCtx: ControllerContext;
    }) =>{
        let router = express.Router();
        // setting router name call list in product => /product/list
        router.get('/list', controllerCtx.productController.findAll);

        return router
    } 