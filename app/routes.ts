import express from "express";
import { UserTableController } from "./controllers/DataBase/UserTableController";

require("./database/index")

const routes = express.Router();

routes.get('/api/v1/users', async (req, res) => {
  const userController = new UserTableController();
  res.json(await userController.searchAll());
})
routes.post('/api/v1/users', async (req, res) => {
  const userController = new UserTableController();
  res.json(await userController.create(req.body));
})
routes.get('/api/v1/users/:user_id', async (req, res) => {
  const userController = new UserTableController();
  res.json(await userController.searchById(req.body));
})



export { routes }