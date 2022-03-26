import express from "express";
import { ConferencesTableController } from "./controllers/DataBase/ConferencesTableController";
import { ProductsTableController } from "./controllers/DataBase/ProductsTableController";
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


export { routes }