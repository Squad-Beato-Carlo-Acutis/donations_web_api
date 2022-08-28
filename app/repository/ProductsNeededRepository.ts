import sequelize from "sequelize";
import { TabConfereces } from "../models/TabConfereces";
import {
  TabProductsNeeded,
  TypeProductsNeededRepository,
  TypeTabProductsNeeded,
} from "../models/TabProductsNeeded";
import { TabProductStockMovement } from "../models/TabProductStockMovement";
import { TabUsers } from "../models/TabUsers";

export class ProductsNeededRepository {
  async searchAllProducts(
    userId: number,
    conferenceId: number
  ): Promise<Array<any>> {
    return TabProductsNeeded.findAll({
      where: {
        tb_user_id: userId,
        tb_conference_id: conferenceId,
      },
      include: [
        {
          association: "products",
          include: [{ association: "measure" }, { association: "category" }],
        },
      ],
    });
  }

  async createOrUpdate(
    userId: number,
    conferenceId: number,
    data: Array<TypeProductsNeededRepository>
  ): Promise<TypeTabProductsNeeded[]> {
    if (!(await TabUsers.findByPk(userId)))
      throw new Error("Usuário não encontrado");

    if (!(await TabConfereces.findByPk(conferenceId)))
      throw new Error("Usuário não encontrado");

    if(!data?.length) {
      await TabProductsNeeded.destroy({
        where: {
          tb_conference_id: conferenceId
        }
      })

      return []
    }

    return Promise.all(
      data.map(async (product) => {
        const dataInsert: TypeTabProductsNeeded = {
          tb_user_id: userId,
          tb_conference_id: conferenceId,
          tb_product_id: product.productId,
          quantity: product.quantity,
        };

        const productNeeded = await TabProductsNeeded.findOne({
          where: {
            tb_user_id: userId,
            tb_conference_id: conferenceId,
            tb_product_id: product.productId,
          },
        });

        if (productNeeded) {
          await productNeeded.update(dataInsert);
        } else {
          await TabProductsNeeded.create(dataInsert);
        }

        return dataInsert;
      })
    );
  }

  async delete(
    userId: number,
    conferenceId: number,
    productId: Array<{
      productId: number;
    }>
  ): Promise<boolean> {
    productId.forEach(async (product) => {
      await TabProductsNeeded.destroy({
        where: {
          tb_user_id: userId,
          tb_conference_id: conferenceId,
          tb_product_id: product.productId,
        },
      });
    });

    return true;
  }
}
