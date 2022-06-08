import express from "express";
import { BasicBasketTableController } from "./controllers/DataBase/BasicBasketTableController";
import { ConferencesTableController } from "./controllers/DataBase/ConferencesTableController";
import { ProductsNeededController } from "./controllers/DataBase/ProductsNeededController";
import { ProductsTableController } from "./controllers/DataBase/ProductsTableController";
import { StockMovementController } from "./controllers/DataBase/StockMovementController";
import { UserTableController } from "./controllers/DataBase/UserTableController";
import { userAuth } from "./middlewares/userAuth";

require("./database/index")

const routes = express.Router();

// Routes login
routes.post('/api/v1/login', UserTableController.login)

// Routes User
routes.get('/api/v1/users', userAuth, UserTableController.getAll)
routes.post('/api/v1/users', UserTableController.create)
routes.get('/api/v1/users/:userId', userAuth, UserTableController.getById)
routes.patch('/api/v1/users/:userId', userAuth, UserTableController.update)
routes.delete('/api/v1/users/:userId', userAuth, UserTableController.delete)

// Routes Conferences
routes.get('/api/v1/users/:userId/conferences', userAuth, ConferencesTableController.getAll)
routes.post('/api/v1/users/:userId/conferences', userAuth, ConferencesTableController.create)
routes.get('/api/v1/users/:userId/conferences/:conferenceId', userAuth, ConferencesTableController.getById)
routes.patch('/api/v1/users/:userId/conferences/:conferenceId', userAuth, ConferencesTableController.update)
routes.delete('/api/v1/users/:userId/conferences/:conferenceId', userAuth, ConferencesTableController.delete)

// Routes Products
routes.get('/api/v1/users/:userId/products', userAuth, ProductsTableController.getAll)
routes.post('/api/v1/users/:userId/products', userAuth, ProductsTableController.create)
routes.get('/api/v1/users/:userId/products/:productId', userAuth, ProductsTableController.getById)
routes.patch('/api/v1/users/:userId/products/:productId', userAuth, ProductsTableController.update)
routes.delete('/api/v1/users/:userId/products/:productId', userAuth, ProductsTableController.delete)

// Routes BasicBasket
routes.get('/api/v1/users/:userId/basicbasket', userAuth, BasicBasketTableController.getAll)
routes.post('/api/v1/users/:userId/basicbasket', userAuth, BasicBasketTableController.create)
routes.get('/api/v1/users/:userId/basicbasket/:basicBasketId', userAuth, BasicBasketTableController.getById)
routes.patch('/api/v1/users/:userId/basicbasket/:basicBasketId', userAuth, BasicBasketTableController.update)
routes.delete('/api/v1/users/:userId/basicbasket/:basicBasketId', userAuth, BasicBasketTableController.delete)
routes.post('/api/v1/users/:userId/basicbasket/:basicBasketId/product', userAuth, BasicBasketTableController.insertProduct)
routes.delete('/api/v1/users/:userId/basicbasket/:basicBasketId/product/:productId', userAuth, BasicBasketTableController.deleteProduct)

// Routes Products Needed
routes.get('/api/v1/users/:userId/conference/:conferenceId/productsneeded', userAuth, ProductsNeededController.getAll)
routes.post('/api/v1/users/:userId/conference/:conferenceId/productsneeded', userAuth, ProductsNeededController.createOrUpdate)
routes.delete('/api/v1/users/:userId/conference/:conferenceId/productsneeded', userAuth, ProductsNeededController.delete)

// Routes Stock
routes.get('/api/v1/users/:userId/conference/:conferenceId/stockmovement', userAuth, StockMovementController.getAll)
routes.get('/api/v1/users/:userId/conference/:conferenceId/stockmovement/:stockMovementId', userAuth, StockMovementController.getById)
routes.post('/api/v1/users/:userId/conference/:conferenceId/stockmovement', userAuth, StockMovementController.generateStockMovement)
routes.delete('/api/v1/users/:userId/conference/:conferenceId/stockmovement/:stockMovementId', userAuth, StockMovementController.inactivateStockMovement)
routes.get('/api/v1/users/:userId/conference/:conferenceId/currentstock', userAuth, StockMovementController.getCurrentStock)
routes.get('/api/v1/users/:userId/conference/:conferenceId/neededproductsstock', userAuth, StockMovementController.getNeededProductsStock)


export { routes }