// src/config/database.js
import { Sequelize } from "sequelize";
import env from 'dotenv'
env.config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE,   // database
  process.env.PG_USER,   // username
  process.env.PG_PASSWORD, // password
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;
