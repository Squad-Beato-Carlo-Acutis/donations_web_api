import { DataTypes, Model, ModelStatic } from "sequelize";

class TabUser extends Model {
  static init(sequelize: any) {
    return super.init({
      email: DataTypes.STRING,
      pws: DataTypes.STRING,
      username: DataTypes.STRING,
      ind_active: DataTypes.BOOLEAN,
    }, {
      sequelize
    })
  }
}

export { TabUser }