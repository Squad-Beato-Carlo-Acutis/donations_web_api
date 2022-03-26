import { Model, DataTypes } from "sequelize";

export type TypeTabCategories = {
  id?: number;
  tb_users_id: number;
  description: string;
  posit_level: number;
  ind_active: boolean
};

export class TabCategories extends Model<TypeTabCategories> {
  static initialize(sequelize: any) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          unique: "compositeIndex",
        },
        tb_users_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: "compositeIndex",
        },
        description: DataTypes.STRING,
        posit_level: DataTypes.NUMBER,
        ind_active: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: "tb_categories",
      }
    );
  }
}
