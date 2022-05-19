import { DataTypes, Model } from "sequelize";

export type TypeTabProductsNeeded = {
  tb_user_id: number;
  tb_conference_id: number;
  tb_product_id: number;
  quantity: number;
};

export type TypeProductsNeededRepository = {
  productId: number;
  productDescription?: string;
  productMeasurement?: string;
  quantity: number;
}

export class TabProductsNeeded extends Model<TypeTabProductsNeeded> {
  static initialize(sequelize: any) {
    this.init(
      {
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
        tb_product_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: "compositeIndex",
        },
        quantity: DataTypes.NUMBER,
      },
      {
        sequelize,
        tableName: "tb_products_needed",
      }
    );
  }

  static associate(models: any) {

    this.hasOne(models.TabProducts, {
      sourceKey: "tb_product_id",
      foreignKey: "id",
      as: "products",
    });
    
  }
}
