import { TabBasicBasket, TypeTabBasicBasket } from "../models/TabBasicBasket";
import { TabProductBasicBasket, TypeInsertByBasicBasket } from "../models/TabProductBasicBasket";
import { TabUsers } from "../models/TabUsers";

export class BasicBasketTableRepository {
  async searchById(userId: number, basicBasketId: number): Promise<TabBasicBasket> {
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

  async searchAll(userId: number): Promise<Array<TabBasicBasket>> {
    console.log("userId => ", userId)
    return await TabBasicBasket.findAll({
      where: {
        tb_user_id: userId,
      },
      include: [{ association: "products" }],
    });
  }

  async create(userId: number, basicBasket: TypeTabBasicBasket): Promise<TabBasicBasket> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const basicBasketRegister = await TabBasicBasket.create({
      tb_user_id: userId,
      description: basicBasket.description,
      ind_active: basicBasket.ind_active,
    });

    return basicBasketRegister;
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

  async insertProduct(userId: number, basicBasketId: number, productBasicBasket: TypeInsertByBasicBasket): Promise<TabProductBasicBasket> {
    const basicBasket = await TabBasicBasket.findByPk(basicBasketId);
    if (!basicBasket) throw new Error("Cesta Básica não encontrada");

    const productBasicBasketRegister = await TabProductBasicBasket.create({
      tb_user_id: userId,
      tb_basic_basket_id: basicBasketId,
      tb_product_id: productBasicBasket.productId,
      quantity: productBasicBasket.quantity,
      priority: productBasicBasket.priority,
      ind_essential: productBasicBasket.ind_essential,
      ind_active: productBasicBasket.ind_active,
    });

    return productBasicBasketRegister;
  }

  async deleteProduct(userId: number, basicBasketId: number, productId: number): Promise<boolean> {
    const basicBasket = await TabBasicBasket.findByPk(basicBasketId);
    if (!basicBasket) throw new Error("Cesta Básica não encontrada");

    const productBasicBasketRegister = await TabProductBasicBasket.findOne({
      where: {
        tb_basic_basket_id: basicBasketId,
        tb_user_id: userId,
        tb_product_id: productId
      },
    });
    if (!productBasicBasketRegister) throw new Error("Produto da cesta básica não encontrado");

    productBasicBasketRegister.destroy();

    return true;
  }
}
