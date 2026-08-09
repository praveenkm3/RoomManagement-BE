import { DataSource } from "typeorm";
import { Users } from "./Entities/Users.ts";
import { Bookings } from "./Entities/Bookings.ts";
import { Attendies } from "./Entities/Attendies.ts";
import { Rooms } from "./Entities/Rooms.ts";
import "reflect-metadata";
import "dotenv/config"

const DB_USER =process.env.DB_USER
const DB_HOST=process.env.DB_HOST       
const DB_NAME=process.env.DB_NAME      
const DB_PASSWORD=process.env.DB_PASSWORD   
const DB_PORT=Number(process.env.DB_PORT) 




export const AppDataSource = new DataSource({
    type:DB_USER as 'postgres',
    host:DB_HOST as string ,
    port: DB_PORT as number,
    username: DB_USER as string,
    password: DB_PASSWORD as string,
    database: DB_NAME as string,
    synchronize: false,
    logging: true,
    entities: [Users,Rooms,Bookings,Attendies],
    migrations: ["src/migrations/**/*.ts"],
})