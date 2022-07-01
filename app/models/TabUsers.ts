import { DataTypes, Model, ModelStatic } from "sequelize";

export type TypeTabUsers = {
  id?: number
  email: string,
  pws: string,
  username: string,
  ind_active: boolean,
  type_user?: string
};

export class TabUsers extends Model<TypeTabUsers> {
  static initialize(sequelize: any){
    this.init({
      email: DataTypes.STRING,
      pws: DataTypes.STRING,
      username: DataTypes.STRING,
      ind_active: DataTypes.BOOLEAN,
      type_user: DataTypes.STRING,
    }, {
      sequelize,
      tableName: 'tb_users'
    })
  }


  static associate(models: any){
    this.hasMany(models.TabConfereces, { foreignKey: 'tb_user_id', as: 'confereces'})
    this.hasMany(models.TabProducts, { foreignKey: 'tb_user_id', as: 'products'})
  }
}
