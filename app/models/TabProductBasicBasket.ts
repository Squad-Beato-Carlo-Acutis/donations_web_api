import { DataTypes, Model, ModelStatic } from "sequelize";

export type TypeTabProductBasicBasket = {
  id?: number;
  tb_user_id: number;
  tb_basic_basket_id: number;
  tb_product_id: number;
  quantity: number;
  priority: number;
  ind_essential: boolean;
  ind_active: boolean;
};

export type TypeInsertByBasicBasket = {
  productId: number;
  quantity: number;
  priority: number;
  ind_essential: boolean;
  ind_active: boolean;
}

export class TabProductBasicBasket extends Model<TypeTabProductBasicBasket> {
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
        tb_basic_basket_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: "compositeIndex",
        },
        tb_product_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: "compositeIndex",
        },
        quantity: DataTypes.NUMBER,
        priority: DataTypes.NUMBER,
        ind_essential: DataTypes.BOOLEAN,
        ind_active: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: "tb_product_basic_basket",
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
