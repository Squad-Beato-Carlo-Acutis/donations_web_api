import { Sequelize } from "sequelize";
const dbConfig = require("../config/database")

export const conection = new Sequelize(dbConfig)