import { TabBasicBasket, TypeTabBasicBasket } from "../models/TabBasicBasket";
import {
  TabProductBasicBasket,
  TypeInsertByBasicBasket,
} from "../models/TabProductBasicBasket";
import { TabUsers } from "../models/TabUsers";
import { PaginationType } from "../types/PaginationType";

export class BasicBasketTableRepository {
  async searchById(
    userId: number,
    basicBasketId: number
  ): Promise<TabBasicBasket> {
    const basicBasket = await TabBasicBasket.findOne({
      where: {
        id: basicBasketId,
        tb_user_id: userId,
      },
      include: [{ association: "products" }],
    });
    if (!basicBasket) throw new Error("Cesta Básica não encontrada");
    return basicBasket;
  }

  async searchAll(
    userId: number,
    pagination?: PaginationType
  ): Promise<{
    data: Array<TabBasicBasket>;
    totalPages: number;
  }> {
    const offset = pagination?.page
      ? parseInt(pagination?.page, 10) - 1
      : undefined;
    const limit = pagination?.limit
      ? parseInt(pagination?.limit, 10)
      : undefined;

    const page = offset && offset !== -1 && limit ? offset * limit : 0;

    const basicBaskets = await TabBasicBasket.findAndCountAll({
      limit,
      offset: page,
      where: {
        tb_user_id: userId,
      },
      include: [{ association: "products" }],
    });

    return {
      data: basicBaskets.rows,
      totalPages: parseInt((limit ? basicBaskets.count / limit : 1).toFixed(0)),
    };
  }

  async create(
    userId: number,
    basicBasket: TypeTabBasicBasket
  ): Promise<TabBasicBasket> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    return TabBasicBasket.create({
      tb_user_id: userId,
      description: basicBasket.description,
      ind_active: basicBasket.ind_active,
    });
  }

  async update(
    userId: number,
    basicBasketId: number,
    data: TypeTabBasicBasket
  ): Promise<TabBasicBasket> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const basicBasket = await TabBasicBasket.findByPk(basicBasketId);
    if (!basicBasket) throw new Error("Cesta Básica não encontrada");

    await basicBasket.update(data);

    return basicBasket;
  }

  async delete(userId: number, basicBasketId: number): Promise<boolean> {
    const basicBasket = await TabBasicBasket.findOne({
      where: {
        id: basicBasketId,
        tb_user_id: userId,
      },
    });
    if (!basicBasket) throw new Error("Cesta Básica não encontrada");

    basicBasket.destroy();

    return true;
  }

  // Products

  async insertProduct(
    userId: number,
    basicBasketId: number,
    productBasicBasket: TypeInsertByBasicBasket
  ): Promise<TabProductBasicBasket> {
    const basicBasket = await TabBasicBasket.findByPk(basicBasketId);
    if (!basicBasket) throw new Error("Cesta Básica não encontrada");

    return TabProductBasicBasket.create({
      tb_user_id: userId,
      tb_basic_basket_id: basicBasketId,
      tb_product_id: productBasicBasket.productId,
      quantity: productBasicBasket.quantity,
      priority: productBasicBasket.priority,
      ind_essential: productBasicBasket.ind_essential,
      ind_active: productBasicBasket.ind_active,
    });
  }

  async deleteProduct(
    userId: number,
    basicBasketId: number,
    productId: number
  ): Promise<boolean> {
    const basicBasket = await TabBasicBasket.findByPk(basicBasketId);
    if (!basicBasket) throw new Error("Cesta Básica não encontrada");

    const productBasicBasketRegister = await TabProductBasicBasket.findOne({
      where: {
        tb_basic_basket_id: basicBasketId,
        tb_user_id: userId,
        tb_product_id: productId,
      },
    });
    if (!productBasicBasketRegister)
      throw new Error("Produto da cesta básica não encontrado");

    productBasicBasketRegister.destroy();

    return true;
  }
}
