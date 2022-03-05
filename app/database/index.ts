import { Sequelize } from "sequelize";
import { TabConfereces } from "../models/TabConfereces";
import { TabUsers } from "../models/TabUsers";
const dbConfig = require("../config/database")

export const conection = new Sequelize(dbConfig)

TabUsers.initialize(conection)
TabConfereces.initialize(conection)

TabUsers.associate(conection.models)
TabConfereces.associate(conection.models)