import { DataTypes, Model, ModelStatic } from "sequelize";

export type TypeTabBasicBasket = {
  id?: number;
  tb_user_id: number;
  description: string;
  ind_active: boolean;
};

export class TabBasicBasket extends Model<TypeTabBasicBasket> {
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
        ind_active: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: "tb_basic_basket",
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.TabUsers, { foreignKey: "tb_user_id", as: "users" });

    this.hasMany(models.TabProductBasicBasket, {
      sourceKey: "id",
      foreignKey: "tb_basic_basket_id",
      as: "products",
    });
  }
}
