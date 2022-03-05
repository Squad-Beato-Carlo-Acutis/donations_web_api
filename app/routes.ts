import express from "express";
import { UserTableController } from "./controllers/DataBase/UserTableController";

const routes = express.Router();

routes.get('/users', async (req, res) => {
  const userController = new UserTableController();
  res.json(await userController.searchAll());
})


export { routes }