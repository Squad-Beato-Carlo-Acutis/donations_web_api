import { TabCategories, TypeTabCategories } from "../models/TabCategories";
import { PaginationType } from "../types/PaginationType";

export class CategoryTableRepository {

  async searchAll(pagination?: PaginationType): Promise<{
    data: Array<TabCategories>;
    totalPages: number;
  }> {
    const offset = pagination?.page
      ? parseInt(pagination?.page, 10) - 1
      : undefined;
    const limit = pagination?.limit
      ? parseInt(pagination?.limit, 10)
      : undefined;

    const page = offset && offset !== -1 && limit ? offset * limit : 0;

    const categories = await TabCategories.findAndCountAll({
      limit,
      offset: page,
      attributes: ["id", "description", "posit_level", "ind_active"],
    });

    return {
      data: categories.rows,
      totalPages: parseInt((limit ? categories.count / limit : 1).toFixed(0)),
    };
  }

  async create(userId: number, categorie: TypeTabCategories): Promise<TabCategories> {

    const categorieCreate: TypeTabCategories = {
      description: categorie.description,
      posit_level: categorie.posit_level,
      tb_user_id: userId,
      ind_active: true
    };

    return TabCategories.create(categorieCreate);
  }

  async update( userId: number, categorieId: number, data: TypeTabCategories): Promise<TabCategories> {
    const categorie = await TabCategories.findOne({
      where: {
        id: categorieId,
        tb_user_id: userId
      }
    });
    if (!categorie) throw new Error("Categoria não encontrada");

    await categorie.update(data);

    return categorie;
  }

  async delete(userId: number, categorieId: number): Promise<boolean> {
    const categorie = await TabCategories.findOne({
      where: {
        tb_user_id: userId,
        id: categorieId
      }
    });
    if (!categorie) throw new Error("Categoria não encontrada");

    categorie.destroy();

    return true;
  }
}
