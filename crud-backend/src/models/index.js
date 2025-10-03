// src/models/index.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import ClientModelFactory from "./ClientModel.js";

const ClientModel = ClientModelFactory(sequelize, DataTypes);

// You can add more models here later
const db = {
  sequelize,
  ClientModel,
};

export default db;
