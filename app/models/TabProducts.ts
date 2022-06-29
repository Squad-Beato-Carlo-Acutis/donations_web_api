import { DataTypes, Model, ModelStatic } from "sequelize";

export type TypeTabProducts = {
  id?: number;
  tb_user_id: number;
  description: string;
  tb_measure_id: number;
  tb_category_id: number;
  ind_active: boolean;
  link_image?: string;
};

export class TabProducts extends Model<TypeTabProducts> {
  static initialize(sequelize: any) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          unique: "compositeIndex",
        },
        tb_user_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: "compositeIndex",
        },
        description: DataTypes.STRING,
        tb_measure_id: DataTypes.NUMBER,
        tb_category_id: DataTypes.NUMBER,
        ind_active: DataTypes.BOOLEAN,
        link_image: DataTypes.STRING(100),
      },
      {
        sequelize,
        tableName: "tb_products",
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.TabUsers, { foreignKey: "tb_user_id", as: "users" });

    this.hasOne(models.TabMeasures, {
      sourceKey: "tb_measure_id",
      foreignKey: "id",
      as: "measure",
    });
    this.hasOne(models.TabCategories, {
      sourceKey: "tb_category_id",
      foreignKey: "id",
      as: "category",
    });
  }
}
