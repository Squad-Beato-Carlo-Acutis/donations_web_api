import { TabMeasures, TypeTabMeasures } from "../models/TabMeasures";
import { PaginationType } from "../types/PaginationType";

export class MeasureTableRepository {

  async searchAll(pagination?: PaginationType): Promise<{
    data: Array<TabMeasures>;
    totalPages: number;
  }> {
    const offset = pagination?.page
      ? parseInt(pagination?.page, 10) - 1
      : undefined;
    const limit = pagination?.limit
      ? parseInt(pagination?.limit, 10)
      : undefined;

    const page = offset && offset !== -1 && limit ? offset * limit : 0;

    const measures = await TabMeasures.findAndCountAll({
      limit,
      offset: page,
      attributes: ["description", "abbreviation"],
    });

    return {
      data: measures.rows,
      totalPages: parseInt((limit ? measures.count / limit : 1).toFixed(0)),
    };
  }

  async create(userId: number, measure: TypeTabMeasures): Promise<TabMeasures> {

    const measureCreate: TypeTabMeasures = {
      description: measure.description,
      abbreviation: measure.abbreviation,
      tb_user_id: userId
    };

    return TabMeasures.create(measureCreate);
  }

  async update(measureId: number, userId: number, data: TypeTabMeasures): Promise<TabMeasures> {
    const measure = await TabMeasures.findOne({
      where: {
        id: measureId,
        tb_user_id: userId
      }
    });
    if (!measure) throw new Error("Usuário não encontrado");

    await measure.update(data);

    return measure;
  }

  async delete(userId: number, measureId: number): Promise<boolean> {
    const measure = await TabMeasures.findOne({
      where: {
        tb_user_id: userId,
        id: measureId
      }
    });
    if (!measure) throw new Error("Usuário não encontrado");

    measure.destroy();

    return true;
  }
}
