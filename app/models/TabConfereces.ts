import { Model, DataTypes } from "sequelize";

export type TypeTabConfereces = {
  id?: number;
  tb_user_id: number;
  description: string;
  link_avatar: string;
  about: string;
  title_address: string;
  address: string;
  opening_hours: string;
  map_iframe: string;
  ind_active: boolean;
};

export class TabConfereces extends Model<TypeTabConfereces> {
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
        link_avatar: DataTypes.STRING,
        about: DataTypes.STRING,
        title_address: DataTypes.STRING,
        address: DataTypes.STRING,
        opening_hours: DataTypes.STRING,
        map_iframe: DataTypes.STRING,
        ind_active: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: "tb_conferences",
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.TabUsers, { foreignKey: "tb_user_id", as: "users" });
  }
}
