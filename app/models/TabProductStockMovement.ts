import { DataTypes, Model, ModelStatic } from "sequelize";

export type TypeTabItemStockMovement = {
  id?: number;
  tb_stock_movement_id: number;
  tb_product_id: number;
  movement_value: number;
  type_movement: string;
};

export class TabProductStockMovement extends Model<TypeTabItemStockMovement> {
  static initialize(sequelize: any) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          unique: "compositeIndex",
        },
        tb_stock_movement_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: "compositeIndex",
        },
        tb_product_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: "compositeIndex",
        },
        movement_value: DataTypes.DOUBLE,
        type_movement: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "tb_product_stock_movement",
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.TabUsers, { foreignKey: "tb_user_id", as: "users" });

    this.hasOne(models.TabProducts, {
      sourceKey: "tb_product_id",
      foreignKey: "id",
      as: "product",
    });
  }
}
