import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from 'path';
dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [path.join(__dirname, './../../../entities/*.{ts,js}')],
    subscribers: [],
    migrations: [],
})
