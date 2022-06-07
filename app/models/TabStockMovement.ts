import { DataTypes, Model, ModelStatic } from "sequelize";
import { TypeTabItemStockMovement } from "./TabProductStockMovement";

export type TypeTabStockMovement = {
  id?: number;
  tb_user_id: number;
  tb_conference_id: number;
  movement_date: Date;
  movement_description: string;
  ind_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  products?: TypeTabItemStockMovement[];
};

export class TabStockMovement extends Model<TypeTabStockMovement> {
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
        tb_conference_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: "compositeIndex",
        },
        movement_date: {
          type: DataTypes.DATE,
          allowNull: false
        },
        movement_description: {
          type: DataTypes.STRING,
          allowNull: false
        },
        ind_active: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: "tb_stock_movement",
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.TabUsers, { foreignKey: "tb_user_id", as: "users" });

    this.hasMany(models.TabProductStockMovement, {
      sourceKey: "id",
      foreignKey: "tb_stock_movement_id",
      as: "products",
    });
  }
}
