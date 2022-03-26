import { DataTypes, Model, ModelStatic } from "sequelize";

export type TypeTabProducts = {
  id?: number
  tb_user_id: number
  description: string
  tb_measure_id: number
  tb_category_id: number
  ind_active: boolean
};

export class TabProducts extends Model<TypeTabProducts> {
  static initialize(sequelize: any){
    this.init({
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
    }, {
      sequelize,
      tableName: 'tb_products'
    })
  }


  static associate(models: any) {
    this.belongsTo(models.TabUsers, { foreignKey: "tb_users_id", as: "users" });

    this.hasOne(models.TabMeasures, {foreignKey: "tb_measures_id", as: "measures"})
    this.hasOne(models.TabCategories, {foreignKey: "tb_categories", as: "categories"})
  }
}
