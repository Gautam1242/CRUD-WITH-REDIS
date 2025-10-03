// src/models/ClientModel.js
const ClientModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "ClientModel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      job: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      rate: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 100.0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "isactive",
      },
    },
    {
      tableName: "clients_tb",
      schema: "public",
      timestamps: false,
      underscored: true,
    }
  );
};

export default ClientModel;
