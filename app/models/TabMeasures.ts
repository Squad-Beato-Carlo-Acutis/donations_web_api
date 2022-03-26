import { Model, DataTypes } from "sequelize";

export type TypeTabMeasures = {
  id?: number;
  tb_users_id: number;
  description: string;
  abbreviation: string;
};

export class TabMeasures extends Model<TypeTabMeasures> {
  static initialize(sequelize: any) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          unique: "compositeIndex",
        },
        tb_users_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: "compositeIndex",
        },
        description: DataTypes.STRING,
        abbreviation: DataTypes.STRING
      },
      {
        sequelize,
        tableName: "tb_measures",
      }
    );
  }
}
