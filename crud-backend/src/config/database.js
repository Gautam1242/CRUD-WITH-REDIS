// src/config/database.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load the Docker-specific env file
dotenv.config({ path: ".env.docker" });

const sequelize = new Sequelize(
  process.env.DB_NAME,      // database
  process.env.DB_USER,      // username
  process.env.DB_PASSWORD,  // password
  {
    host: process.env.DB_HOST,  // use Docker service name
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;
