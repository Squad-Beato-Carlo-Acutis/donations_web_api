import sequelize from "sequelize";
import { conection } from "../database";
import { TabConfereces } from "../models/TabConfereces";
import {
  TabProductsNeeded,
  TypeProductsNeededRepository,
} from "../models/TabProductsNeeded";
import { TabProductStockMovement } from "../models/TabProductStockMovement";
import { TabStockMovement } from "../models/TabStockMovement";
import { TabUsers } from "../models/TabUsers";
import { PaginationType } from "../types/PaginationType";
import { ProductsNeededRepository } from "./ProductsNeededRepository";

type TypeProductMovement = {
  productId: number;
  movement_value: number;
};

type TypeGenerateStockMovement = {
  userId: number;
  conferenceId: number;
  products: TypeProductMovement[];
  movementDescription: string;
};

type TypeGetCurrentStock = {
  productId: number;
  productDescription: string;
  productMeasurement: string;
  productCategory: string;
  currentQuantity: string;
};

export class StockMovementRepository {
  async searchById(
    userId: number,
    stockMovementId: number,
    conferenceId: number
  ): Promise<TabStockMovement> {
    const stockMovement = await TabStockMovement.findOne({
      where: {
        id: stockMovementId,
        tb_user_id: userId,
        tb_conference_id: conferenceId,
      },
      include: [{ association: "products" }],
    });
    if (!stockMovement) throw new Error("Movimento de Estoque não encontrado");
    return stockMovement;
  }

  async searchAll(
    userId: number,
    conferenceId: number,
    pagination?: PaginationType
  ): Promise<{
    data: Array<TabStockMovement>;
    totalPages: number;
  }> {
    const offset = pagination?.page
      ? parseInt(pagination?.page, 10) - 1
      : undefined;
    const limit = pagination?.limit
      ? parseInt(pagination?.limit, 10)
      : undefined;

    const page = offset && offset !== -1 && limit ? offset * limit : 0;

    const stockMovements = await TabStockMovement.findAndCountAll({
      limit,
      offset: page,
      where: {
        tb_user_id: userId,
        tb_conference_id: conferenceId,
      },
      include: [
        {
          association: "products",
          attributes: [["movement_value", "quantity"]],
          include: [
            {
              association: "product",
              attributes: [
                ["id", "productId"],
                ["description", "description"],
              ],
              include: [
                {
                  association: "measure",
                  attributes: [
                    ["id", "measureId"],
                    ["description", "description"],
                    ["abbreviation", "abbreviation"],
                  ],
                },
                {
                  association: "category",
                  attributes: [
                    ["id", "categoryId"],
                    ["description", "description"],
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [["movement_date", "DESC"]],
    });

    return {
      data: stockMovements.rows,
      totalPages: parseInt(
        (limit ? stockMovements.count / limit : 1).toFixed(0)
      ),
    };
  }

  async generateStockMovement({
    userId,
    conferenceId,
    products,
    movementDescription,
  }: TypeGenerateStockMovement): Promise<boolean> {
    const t = await conection.transaction();
    try {
      const user = await TabUsers.findByPk(userId);
      if (!user) throw new Error("Usuário não encontrado");

      const conference = await TabConfereces.findByPk(conferenceId);
      if (!conference) throw new Error("Conferencia não encontrada");

      const { data: currentStock } = await this.getCurrentStock(
        userId.toString(),
        conferenceId.toString()
      );

      for (const product in products) {
        for (const currentProduct in currentStock) {
          if (
            products[product].productId ===
              currentStock[currentProduct].productId &&
            products[product].movement_value < 0 &&
            parseInt(currentStock[currentProduct].currentQuantity) <
              products[product].movement_value * -1
          ) {
            throw new Error(
              `A quantidade do produto ${currentStock[currentProduct].productDescription} é insuficiente para a movimentação desejada`
            );
          }
        }
      }

      const movementDate = new Date(Date.now());

      const stockMovement = (
        await TabStockMovement.create(
          {
            tb_user_id: userId,
            tb_conference_id: conferenceId,
            movement_description: movementDescription,
            movement_date: movementDate,
            ind_active: true,
          },
          {
            transaction: t,
          }
        )
      ).toJSON();

      const promisesProduct: any[] = [];

      products.forEach(async (product) => {
        promisesProduct.push(
          TabProductStockMovement.create(
            {
              tb_stock_movement_id: stockMovement.id || 0,
              tb_product_id: product.productId,
              movement_value: product.movement_value,
              type_movement: product.movement_value < 0 ? "S" : "E",
            },
            {
              transaction: t,
            }
          )
        );
      });

      await Promise.all(promisesProduct);

      t.commit();
    } catch (err) {
      t.rollback();
      throw err;
    }

    return true;
  }

  async inactivateStockMovement(
    userId: number,
    stockMovementId: number,
    conferenceId: number
  ): Promise<boolean> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const conference = await TabConfereces.findByPk(conferenceId);
    if (!conference) throw new Error("Conferencia não encontrada");

    const stockMovement = await TabStockMovement.findOne({
      where: {
        id: stockMovementId,
        tb_user_id: userId,
        tb_conference_id: conferenceId,
      },
      include: [{ association: "products" }],
    });
    if (!stockMovement) throw new Error("Movimento de estoque não encontrado");

    await stockMovement.update({
      ind_active: false,
    });

    return true;
  }

  async getCurrentStock(
    userId: string,
    conferenceId: string,
    pagination?: PaginationType
  ): Promise<{
    data: TypeGetCurrentStock[];
    totalPages: number;
  }> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const conference = await TabConfereces.findByPk(conferenceId);
    if (!conference) throw new Error("Conferencia não encontrada");

    const offset = pagination?.page
      ? parseInt(pagination?.page, 10) - 1
      : undefined;
    const limit = pagination?.limit
      ? parseInt(pagination?.limit, 10)
      : undefined;

    const page = offset && offset !== -1 && limit ? offset * limit : 0;

    const currentMovement = await TabStockMovement.findAndCountAll({
      limit,
      subQuery: false,
      offset: page,
      raw: true,
      where: {
        ind_active: true,
        tb_user_id: userId,
        tb_conference_id: conferenceId,
      },
      attributes: [],
      include: [
        {
          association: "products",

          attributes: [
            ["tb_product_id", "productId"],
            [
              sequelize.fn("sum", sequelize.col("movement_value")),
              "currentQuantity",
            ],
          ],
          include: [
            {
              association: "product",
              attributes: [["description", "productDescription"]],
              include: [
                {
                  association: "measure",
                  attributes: [["description", "productMeasurement"]],
                },
                {
                  association: "category",
                  attributes: [["description", "productCategory"]],
                },
              ],
            },
          ],
        },
      ],
      group: [
        "products.tb_product_id",
        "products.product.description",
        "products.product.measure.description",
        "products.product.category.description",
      ],
    });

    const dataReturn = currentMovement?.rows?.map((product: any) => {
      return {
        productId: product["products.productId"],
        productDescription: product["products.product.productDescription"],
        productMeasurement:
          product["products.product.measure.productMeasurement"],
        productCategory: product["products.product.category.productCategory"],
        currentQuantity: product["products.currentQuantity"],
      };
    });

    return {
      data: dataReturn || [],
      totalPages: parseInt(
        (limit ? currentMovement.count?.length / limit : 1).toFixed(0)
      ),
    };
  }

  async getNeededProductsStock(
    userId: number,
    conferenceId: number
  ): Promise<Array<any>> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const conference = await TabConfereces.findByPk(conferenceId);
    if (!conference) throw new Error("Conferencia não encontrada");

    const productsNeededRepository = new ProductsNeededRepository();

    const data = await productsNeededRepository.searchAllProducts(
      userId,
      conferenceId
    );

    const productsNeeded = data.map<TypeProductsNeededRepository>((product) => {
      return {
        productId: product.tb_product_id,
        productDescription: product.products.description,
        productMeasurement: product.products.measure.abbreviation,
        productCategory: product.products.category.description,
        productFullMeasurement: product.products.measure.description,
        productLinkImage: product.products.link_image,
        quantity: product.quantity,
      };
    });

    const { data: currentMovement } = await this.getCurrentStock(
      userId.toString(),
      conferenceId.toString()
    );

    return productsNeeded
      ?.map((productNeeded: any) => {
        const {
          productId,
          productDescription,
          productFullMeasurement: productMeasurement,
          productCategory,
          quantity,
          productLinkImage,
          productFullMeasurement,
        } = productNeeded;

        const productMovement: any = currentMovement.find((product) => {
          return product.productId === productId;
        });

        if (!productMovement) {
          return {
            productId,
            productDescription,
            productMeasurement,
            productCategory,
            quantityNeeded: quantity,
            productLinkImage,
            productFullMeasurement,
          };
        }

        const { currentQuantity } = productMovement;

        const quantityNeeded =
          currentQuantity > quantity ? 0 : quantity - currentQuantity;

        return {
          productId,
          productDescription,
          productMeasurement,
          productCategory,
          quantityNeeded,
          productLinkImage,
          productFullMeasurement,
        };
      })
      .filter((item) => item.quantityNeeded > 0);
  }
}
