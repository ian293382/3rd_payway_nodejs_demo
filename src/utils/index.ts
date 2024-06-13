import knex from "knex";

// 使勇 pool 來減少再次連線成本 斷掉後會有至少兩條接著資料庫供下次連接使用
export const createDatabase = () => {
    return knex({
            client: 'mysql',
            version: '5.7',
            connection: {
              host: process.env.DATABASE_HOST || '127.0.0.1',
              port: Number(process.env.DATABASE_PORT) || 3306,
              user: process.env.DATABASE_USER || 'root',
              password: process.env.DATABASE_PASSWORD || '',
              database: process.env.DATABASE_DATABASE || '3rd_payway',
            },
            pool: {min: 2, max: 10},
    })
}

export  const isJson = (value: string) => {
    try { 
        return Boolean(JSON.parse(value));
    }catch (e) {
        return false;
    }
}
