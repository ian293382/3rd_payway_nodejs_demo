// base此功能為最低基礎功能 會需要knex CRUD 其中 Read會用find代表 分為 find all 和 find one。
// ts 的Omit 用來忽略的 例如在Create 不需要自己建立id 他會自動建立 所以使用Omit<T, 'id',.....> 
// 後面當然還是要正常需要輸入的<T | null> 前方為判斷式後面為輸出
// delete 是因為 資料已經刪除了所以直接回傳void即可 任何資料都丟回void

import { isJson } from "@/utils";
import { Knex } from "knex";
import { camelCase, isEmpty, mapKeys, mapValues, snakeCase } from "lodash";

// T(任意命名)Template 在這階段不該給他真正資料型別 而是等他繼承其他Class 後再給他傳入真正型別
// database transaction 資料庫交易 只要有一個環節出錯就取消 
// select 找一筆訂單, update 將金流釋出, create 創建 log, select 找更新後的訂單
// 實作translation => 在條件那加入參數 這邊命名trx
export interface IBase<T> {
    create(data: Omit<T, 'id'>, trx?: Knex.Transaction):Promise<T | null>;
    findAll(trx?: Knex.Transaction): Promise<T[] |  null>;
    findOne(id: any, trx?: Knex.Transaction): Promise<T | null>;
    update(id: any, data: Partial<Omit <T, 'id'>>, trx? :Knex.Transaction) : Promise<T | null>
    delete(id: any, trx? :Knex.Transaction) : Promise<void>;
}
// 接下來這個class 還沒到可以被實體化出來(instance) 因為product 也要crud order也要 
// 所以目前只是在建立 抽象層 abstract 給他關鍵字
export abstract class Base<T> implements IBase<T> {
    // 實體化需要1.建構子開始建立物件 並且給予型別 ({xx, yy} :{xx:string , yy:int } )
    // yy?:int  問號符號 代表可有可沒有
    // 實體化需求2 內部有參數都要先宣告 大多數protect
    // 出現錯誤：屬性 'tableName' 沒有初始設定式，且未在建構函式中明確指派。 => 就是要給他初使值 = ''

    // 之後會導入mysql table(schema) 近來做出裡所以給他空的{} 去做表格處理之後做繼承就好處理
    protected knexSql: Knex;
    protected tableName: string = '';
    protected schema = {};

    constructor({ knexSql, tableName }: {knexSql: Knex, tableName?: string}) {
        this.knexSql = knexSql;
        if (tableName) this.tableName = tableName;
    }
    // this.schema但是schema是空的呀？ => 因為未來可以使用product 去extend schema 會在後面定義完成
    // 完成了private 和相關設定後會有下面問題
    // 不可指派給類型 '(trx?: Transaction<any, any[]> | undefined) => Promise<T[] | null>'
    // 看後面資料型別 any[] | undefined  T[] |null (原本IBase設定的)不是相同所以回傳值定義他 as T[] 其中T任意命名（要對上IBase) 你只要知道他回傳事[]
    public findAll = async (trx?: Knex.Transaction) => {
        let sqlBuilder = this.knexSql(this.tableName).select(this.schema)
        // transaction 時候要給他只是是哪個表格要做
        if (trx) sqlBuilder = sqlBuilder.transacting(trx)
        
        const result = await sqlBuilder;

        if (isEmpty(result)) return null;
        
        return result.map(this.DBData2DataObject) as T[];
    }
    // 只找第一筆資料(sql: where(id)) result[0]即可 然後回傳值為any=> T 要跟IBase對上即可
    public findOne =  async (id: any, trx?: Knex.Transaction) => {
        let sqlBuilder = this.knexSql(this.tableName).select(this.schema).where(id);
        if (trx) sqlBuilder = sqlBuilder.transacting(trx)
        
        const result = await sqlBuilder;

        if (isEmpty(result)) return null;
        
        return this.DBData2DataObject(result[0]) as T;
    }
    // create 使用insert 插入資料 找值的時候將data 由於我們在網頁端輸入資料是Knex.js => Camel Case 必須做資料轉換sql(snake) 才有辦法塞入DB 
    // 這個從IBase繼承的物件要做轉換 this.DataObject2DB(data)
    // 相反 Knex.js 拉出來要做資料處理的需要用到 使用Camel case 所以才需要將Json轉出來Snake case
    // 預期只會塞入一筆所以多筆的話可能要將前面改成map 跟 T[]
    // 此時這邊一定是根據 pk:id塞入就會在 result[0] 其實這邊this = python.self
    // 回傳值因為order 會用到 trx 建議加上去
    public create =  async(data: Omit<T, 'id'>, trx?: Knex.Transaction) => {
        let sqlBuilder = this.knexSql(this.tableName).insert(this.DataObject2DBdata(data))
        if (trx) sqlBuilder = sqlBuilder.transacting(trx)
        // knex一定是要跟遠方 db做溝通的 await
        const result = await sqlBuilder;

        if (isEmpty(result)) return null;

        const id = result[0]
        // 經過處理後 const processResult = await this.findOne(id) return processResult 可以簡寫 因為只用一次
        // 要跟database做溝通 所以要await
        return await this.findOne(id, trx)
    }
    // 參數都要先加上型別 從IBase對照 any or Partial ....
    // update 資料格式和 create（data）原理差不多差在Id 他已經有資料了要找出來啊笨蛋where id參數找到了就不用給他轉換sql的id
    public update = async(id:any, data: Partial<Omit<T, "id">>, trx?: Knex.Transaction) => {
        let sqlBuilder = this.knexSql(this.tableName).update(this.DataObject2DBdata(data)).where({id})
        if (trx) sqlBuilder = sqlBuilder.transacting(trx)
        // knex一定是要跟遠方 db做溝通的 await
        // 與create 不同是不去做 if (isEmpty(result)) return null; 是因為他本來就有值不用回傳空的
        // 處理方式砍掉: 不需要看我目前已經擁有的資料格式 不論有或沒有都直接寫入update 沒變定也一樣 可以用前端填植做輸入控制
         await sqlBuilder;
        // 經過處理後 const processResult = await this.findOne(id)
        // 要跟database做溝通 所以要
        return await this.findOne(id, trx)
    }
    // 刪除的指令非常簡單在knex內就是del() 回傳值null
    public delete = async (id: any, trx?: Knex.Transaction) => {
        let sqlBuilder = this.knexSql(this.tableName).where({ id }).del()
        if (trx) sqlBuilder = sqlBuilder.transacting(trx);
          
        await sqlBuilder;

        return
    };
    // 這邊選取的資料要變成 Camel Case 這裡因為還沒到任何class 實作指定型別 參數都給他any
    // 在database Json 和date 日期資料反轉成 value 也就是把 Camel case 轉成 Snake case
    private DBData2DataObject = (data: any) => {
        const transform = mapValues(data, (value, key) =>{
            if (['updatedAt', 'createdAt'].includes(key)) return new Date(value);

            if (isJson(value)) return JSON.parse(value); // isJson lodash 沒有必須實作 utils

            return value;
        });
        // 因為這邊是要對key 動手腳 相反過來改變key值
        // value 用不到所以參數改成_value
        return mapKeys(transform, (_value, key) => { return( camelCase(key))
           
        });
    }
    // 反著做camel -> snake
    private DataObject2DBdata = (data: any) => {
        const transform = mapValues(data, (value, key) =>{
            if (['updatedAt', 'createdAt'].includes(key)) return new Date(value);

            if (isJson(value)) return JSON.parse(value); // isJson lodash 沒有必須實作 utils

            return value;
        });
        
        return mapKeys(transform, (_value, key) => { return( snakeCase(key))
            
        });
    }


} 