import sequelize from "sequelize";
import { conection } from "../database";
import { TabConfereces } from "../models/TabConfereces";
import { TabProductsNeeded } from "../models/TabProductsNeeded";
import { TabProductStockMovement } from "../models/TabProductStockMovement";
import { TabStockMovement } from "../models/TabStockMovement";
import { TabUsers } from "../models/TabUsers";
import { PaginationType } from "../types/PaginationType";

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
          attributes: [
            ["movement_value", "quantity"],
          ],
          include: [{ 
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
              }
            ],
          }],
        },
      ],
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
    const t = await conection.transaction();
    try {
      const user = await TabUsers.findByPk(userId);
      if (!user) throw new Error("Usuário não encontrado");

      const conference = await TabConfereces.findByPk(conferenceId);
      if (!conference) throw new Error("Conferencia não encontrada");

      const stockMovement = (
        await TabStockMovement.findOne({
          where: {
            id: stockMovementId,
            tb_user_id: userId,
            tb_conference_id: conferenceId,
          },
          include: [{ association: "products" }],
        })
      )?.toJSON();
      if (!stockMovement)
        throw new Error("Movimento de estoque não encontrado");

      const movementDate = new Date(Date.now());

      const newStockMovement = (
        await TabStockMovement.create(
          {
            tb_user_id: userId,
            tb_conference_id: conferenceId,
            movement_description: `Inativação do movimento de estoque Decrilçao: ${stockMovement.movement_description}, ID: ${stockMovementId}, por: fulano`,
            movement_date: movementDate,
            ind_active: true,
          },
          {
            transaction: t,
          }
        )
      ).toJSON();

      const promisesProduct: any[] = [];

      stockMovement.products?.forEach(async (product) => {
        promisesProduct.push(
          TabProductStockMovement.create(
            {
              tb_stock_movement_id: newStockMovement.id || 0,
              tb_product_id: product.tb_product_id,
              movement_value: product.movement_value * -1, // inverte os valores
              type_movement: product.movement_value * -1 < 0 ? "S" : "E",
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

  async getCurrentStock(
    userId: string,
    conferenceId: string
  ): Promise<TypeGetCurrentStock[]> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const conference = await TabConfereces.findByPk(conferenceId);
    if (!conference) throw new Error("Conferencia não encontrada");

    const currentMovement = await TabProductStockMovement.findAll({
      raw: true,
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
      group: [
        "tb_product_id",
        "product.description",
        "product.measure.description",
        "product.category.description",
      ],
    });

    return currentMovement?.map((product: any) => {
      return {
        productId: product.productId,
        productDescription: product["product.productDescription"],
        productMeasurement: product["product.measure.productMeasurement"],
        productCategory: product["product.category.productCategory"],
        currentQuantity: product.currentQuantity,
      };
    });
  }

  async getNeededProductsStock(
    userId: number,
    conferenceId: number
  ): Promise<Array<any>> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const conference = await TabConfereces.findByPk(conferenceId);
    if (!conference) throw new Error("Conferencia não encontrada");

    const productsNeeded = await TabProductsNeeded.findAll({
      where: {
        tb_user_id: userId,
        tb_conference_id: conferenceId,
      },
    });

    const currentMovement = await TabProductStockMovement.findAll({
      raw: true,
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
      where: {
        tb_product_id: productsNeeded.map(
          (productNeeded: any) => productNeeded.tb_product_id
        ),
      },
      group: [
        "tb_product_id",
        "product.description",
        "product.measure.description",
        "product.category.description",
      ],
    });

    return productsNeeded?.map((productNeeded: any) => {
      const productMovement: any = currentMovement.filter(
        (product: any) => product.id === productNeeded.productId
      );

      if (!productMovement?.length) return;

      const [
        {
          productId,
          ["product.productDescription"]: productDescription,
          ["product.measure.productMeasurement"]: productMeasurement,
          ["product.category.productCategory"]: productCategory,
          currentQuantity,
        },
      ] = productMovement;

      const quantityNeeded =
        currentQuantity > productNeeded.quantity
          ? 0
          : productNeeded.quantity - currentQuantity;

      return {
        productId,
        productDescription,
        productMeasurement,
        productCategory,
        quantityNeeded,
      };
    });
  }
}
