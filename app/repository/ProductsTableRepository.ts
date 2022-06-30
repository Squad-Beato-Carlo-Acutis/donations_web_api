import { TabProducts, TypeTabProducts } from "../models/TabProducts";
import { TabUsers } from "../models/TabUsers";

type PaginationType = {
  limit?: string;
  page?: string;
};

export class ProductsTableRepository {
  async searchById(userId: number, productId: number): Promise<TabProducts> {
    const product = await TabProducts.findOne({
      where: {
        id: productId,
        tb_user_id: userId,
      },
      include: [{ association: "measure" }, { association: "category" }],
    });
    if (!product) throw new Error("Produto não encontrado");
    return product;
  }

  async searchAll(
    userId: number,
    pagination?: PaginationType
  ): Promise<{
    data: Array<TabProducts>;
    totalPages: number;
  }> {
    const offset = pagination?.page
      ? parseInt(pagination?.page, 10) - 1
      : undefined;
    const limit = pagination?.limit
      ? parseInt(pagination?.limit, 10)
      : undefined;

    const page = offset && offset !== -1 && limit ? offset * limit : 0;

    const teste = await TabProducts.findAndCountAll({
      limit,
      offset: page,
      where: {
        tb_user_id: userId,
      },
      include: [{ association: "measure" }, { association: "category" }],
    });

    return {
      data: teste.rows,
      totalPages: parseInt((limit ? teste.count / limit : 1).toFixed(0)),
    };
  }

  async create(userId: number, product: TypeTabProducts): Promise<TabProducts> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    return TabProducts.create({
      tb_user_id: userId,
      description: product.description,
      tb_measure_id: product.tb_measure_id,
      tb_category_id: product.tb_category_id,
      ind_active: product.ind_active,
      link_image: product.link_image,
    });
  }

  async update(
    userId: number,
    productId: number,
    data: TypeTabProducts
  ): Promise<TabProducts> {
    const user = await TabUsers.findByPk(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const product = await TabProducts.findByPk(productId);
    if (!product) throw new Error("Produto não encontrado");

    await product.update(data);

    return product;
  }

  async delete(userId: number, productId: number): Promise<boolean> {
    const product = await TabProducts.findOne({
      where: {
        id: productId,
        tb_user_id: userId,
      },
    });
    if (!product) throw new Error("Produto não encontrado");

    product.destroy();

    return true;
  }
}
