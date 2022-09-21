import express from "express";
import { BasicBasketTableController } from "./controllers/DataBase/BasicBasketTableController";
import { CategoryTableController } from "./controllers/DataBase/CategoryTableController";
import { ConferencesTableController } from "./controllers/DataBase/ConferencesTableController";
import { MeasureTableController } from "./controllers/DataBase/MeasureTableController";
import { ProductsNeededController } from "./controllers/DataBase/ProductsNeededController";
import { ProductsTableController } from "./controllers/DataBase/ProductsTableController";
import { StockMovementController } from "./controllers/DataBase/StockMovementController";
import { UserTableController } from "./controllers/DataBase/UserTableController";
import { TokenPercistenceController } from "./controllers/Utils/TokenPercistenceController";
import { customMulter } from "./helpers/uploadImages";
import { userAuth } from "./middlewares/userAuth";

require("./database/index");

const routes = express.Router();

// Routes login
routes.post("/api/v1/login", UserTableController.login);

// Token persistence
routes.post(
  "/api/v1/login/tokenpersistence",
  userAuth,
  TokenPercistenceController.refreshToken
);
routes.post("/api/v1/login/checkSession", userAuth);

// Public routes User
routes.get("/api/v1/user", userAuth, UserTableController.getById);

// Private routes User
routes.get("/api/v1/users", userAuth, UserTableController.getAll);
routes.post("/api/v1/user", userAuth, UserTableController.create);
routes.patch("/api/v1/user/:userId", userAuth, UserTableController.update);
routes.delete("/api/v1/user/:userId", userAuth, UserTableController.delete);

// Routes Conferences
routes.get("/api/v1/conferences", userAuth, ConferencesTableController.getAll);
routes.get(
  "/api/v1/listconferences",
  ConferencesTableController.listConferences
);
routes.post("/api/v1/conferences", userAuth, ConferencesTableController.create);
routes.post(
  "/api/v1/conferences/:conferenceId/uploadimg",
  userAuth,
  customMulter.single("conference_img"),
  ConferencesTableController.uploadImage
);
routes.get(
  "/api/v1/conferences/:conferenceId",
  userAuth,
  ConferencesTableController.getById
);
routes.get(
  "/api/v1/user/:userId/conferences/:conferenceId",
  // userAuth,
  ConferencesTableController.getById
);
routes.patch(
  "/api/v1/conferences/:conferenceId",
  userAuth,
  ConferencesTableController.update
);
routes.delete(
  "/api/v1/conferences/:conferenceId",
  userAuth,
  ConferencesTableController.delete
);

// Routes Products
routes.get("/api/v1/products", userAuth, ProductsTableController.getAll);
routes.post("/api/v1/products", userAuth, ProductsTableController.create);
routes.get(
  "/api/v1/products/:productId",
  userAuth,
  ProductsTableController.getById
);
routes.patch(
  "/api/v1/products/:productId",
  userAuth,
  ProductsTableController.update
);
routes.delete(
  "/api/v1/products/:productId",
  userAuth,
  ProductsTableController.delete
);
routes.post(
  "/api/v1/products/:productId/uploadimg",
  userAuth,
  customMulter.single("product_img"),
  ProductsTableController.uploadImage
);

// Routes BasicBasket
routes.get("/api/v1/basicbasket", userAuth, BasicBasketTableController.getAll);
routes.post("/api/v1/basicbasket", userAuth, BasicBasketTableController.create);
routes.get(
  "/api/v1/basicbasket/:basicBasketId",
  userAuth,
  BasicBasketTableController.getById
);
routes.patch(
  "/api/v1/basicbasket/:basicBasketId",
  userAuth,
  BasicBasketTableController.update
);
routes.delete(
  "/api/v1/basicbasket/:basicBasketId",
  userAuth,
  BasicBasketTableController.delete
);
routes.post(
  "/api/v1/basicbasket/:basicBasketId/product",
  userAuth,
  BasicBasketTableController.insertProduct
);
routes.put(
  "/api/v1/basicbasket/:basicBasketId/product",
  userAuth,
  BasicBasketTableController.deleteAllAndInsertBulkProduct
);
routes.delete(
  "/api/v1/basicbasket/:basicBasketId/product/:productId",
  userAuth,
  BasicBasketTableController.deleteProduct
);

// Routes Products Needed
routes.get(
  "/api/v1/conference/:conferenceId/productsneeded",
  userAuth,
  ProductsNeededController.getAll
);
routes.post(
  "/api/v1/conference/:conferenceId/productsneeded",
  userAuth,
  ProductsNeededController.createOrUpdate
);
routes.delete(
  "/api/v1/conference/:conferenceId/productsneeded",
  userAuth,
  ProductsNeededController.delete
);

// Routes Stock
routes.get(
  "/api/v1/conference/:conferenceId/stockmovement",
  userAuth,
  StockMovementController.getAll
);
routes.get(
  "/api/v1/conference/:conferenceId/stockmovement/:stockMovementId",
  userAuth,
  StockMovementController.getById
);
routes.post(
  "/api/v1/conference/:conferenceId/stockmovement",
  userAuth,
  StockMovementController.generateStockMovement
);
routes.delete(
  "/api/v1/conference/:conferenceId/stockmovement/:stockMovementId",
  userAuth,
  StockMovementController.inactivateStockMovement
);
routes.get(
  "/api/v1/conference/:conferenceId/currentstock",
  userAuth,
  StockMovementController.getCurrentStock
);
routes.get(
  "/api/v1/user/:userId/conference/:conferenceId/neededproductsstock",
  // userAuth,
  StockMovementController.getNeededProductsStock
);

// Private routes Measures
routes.get("/api/v1/measure", userAuth, MeasureTableController.getAll);
routes.post("/api/v1/measure", userAuth, MeasureTableController.create);
routes.patch(
  "/api/v1/measure/:measureId",
  userAuth,
  MeasureTableController.update
);
routes.delete(
  "/api/v1/measure/:measureId",
  userAuth,
  MeasureTableController.delete
);

// Private routes Categoies
routes.get("/api/v1/category", userAuth, CategoryTableController.getAll);
routes.post("/api/v1/category", userAuth, CategoryTableController.create);
routes.patch(
  "/api/v1/category/:categoryId",
  userAuth,
  CategoryTableController.update
);
routes.delete(
  "/api/v1/category/:categoryId",
  userAuth,
  CategoryTableController.delete
);

export { routes };
