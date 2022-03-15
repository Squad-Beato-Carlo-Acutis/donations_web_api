import express from "express";
import { UserTableController } from "./controllers/DataBase/UserTableController";

require("./database/index")

const routes = express.Router();

routes.get('/api/v1/users', UserTableController.getAll)
routes.post('/api/v1/users', UserTableController.create)
routes.get('/api/v1/users/:userId', UserTableController.getById)
routes.patch('/api/v1/users/:userId', UserTableController.update)
routes.delete('/api/v1/users/:userId', UserTableController.delete)


export { routes }