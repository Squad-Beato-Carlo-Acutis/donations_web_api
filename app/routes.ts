import express from "express";
import { UserTableController } from "./controllers/DataBase/UserTableController";
import { userAuth } from "./middlewares/userAuth";

require("./database/index")

const routes = express.Router();

// Routes login
routes.post('/api/v1/login', UserTableController.login)

// Routes User
routes.get('/api/v1/users', userAuth, UserTableController.getAll)
routes.post('/api/v1/users', userAuth, UserTableController.create)
routes.get('/api/v1/users/:userId', userAuth, UserTableController.getById)
routes.patch('/api/v1/users/:userId', userAuth, UserTableController.update)
routes.delete('/api/v1/users/:userId', userAuth, UserTableController.delete)


export { routes }