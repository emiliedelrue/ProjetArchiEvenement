import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        },
        pool: {
            max: 10,              
            min: 2,               
            acquire: 60000,       
            idle: 10000,
            evict: 1000,         
        },
        retry: {
            max: 3,
            timeout: 10000,
        },
        dialectOptions: {
            connectTimeout: 60000,
            acquireTimeout: 60000,
            timeout: 60000,
            multipleStatements: false,
        }
    }
);

export default sequelize;
