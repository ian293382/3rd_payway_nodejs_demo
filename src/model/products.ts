import { Knex } from "knex";
import { IBase, Base } from "./base";

// 轉成 Knex.js寫法
export interface Product {
id: number;
name: string;
amount: number;
description: string;
pre_order: number;
price: number;
}

//這邊就是做IBase 的型別定義從 interface Product而來 這樣就完成定義 也就是CRUD攻能 需要額外功能就在這邊補上
export interface IProductModel extends IBase<Product>{

}
// 從Base延伸過來這邊要實作方法implements IProductModel
export class ProductModel extends Base<Product> implements IProductModel {
    // 直接定義schema = mysql 上product schema schema tableName 這樣不用一直找直傳入
    tableName= 'products';
    // key => databaseObject value-> DB column
    schema = {
        id: 'id',
        name: 'name',
        amount: 'amount',
        description: 'description',
        pre_order: 'pre_order',
        price: 'price',
    }
    
    // 還記得實作功能 1. constructor 轉成實例（instance)
    constructor({ knexSql , tableName }: {knexSql: Knex, tableName?: string}) {
        super({ knexSql, tableName}); // super讓各影響曾只會掉用一次 其餘迭代
    }
    // 新增資料用
    static createModel = ({ 
        knexSql,
        tableName,
    }: {
        // tableName 可有可沒有因為我們都已經有寫上去 products
        knexSql: Knex;
        tableName?: string;
    } )=> {
        // const a =   return new ProductModel({ knexSql, tableName });
        // a. 則可以顯示 base方法
        return new ProductModel({ knexSql, tableName });
    }
}



