import { Sequelize } from "sequelize";
import { TabBasicBasket } from "../models/TabBasicBasket";
import { TabCategories } from "../models/TabCategories";
import { TabConfereces } from "../models/TabConfereces";
import { TabMeasures } from "../models/TabMeasures";
import { TabProductBasicBasket } from "../models/TabProductBasicBasket";
import { TabProducts } from "../models/TabProducts";
import { TabProductsNeeded } from "../models/TabProductsNeeded";
import { TabProductStockMovement } from "../models/TabProductStockMovement";
import { TabStockMovement } from "../models/TabStockMovement";
import { TabUsers } from "../models/TabUsers";
const dbConfig = require("../config/database")

export const conection = new Sequelize(dbConfig)

TabUsers.initialize(conection)
TabConfereces.initialize(conection)
TabMeasures.initialize(conection)
TabCategories.initialize(conection)
TabProducts.initialize(conection)
TabBasicBasket.initialize(conection)
TabProductBasicBasket.initialize(conection)
TabProductsNeeded.initialize(conection)
TabStockMovement.initialize(conection)
TabProductStockMovement.initialize(conection)

TabUsers.associate(conection.models)
TabConfereces.associate(conection.models)
TabProducts.associate(conection.models)
TabBasicBasket.associate(conection.models)
TabProductsNeeded.associate(conection.models)
TabStockMovement.associate(conection.models)
TabProductStockMovement.associate(conection.models)
TabProductBasicBasket.associate(conection.models)