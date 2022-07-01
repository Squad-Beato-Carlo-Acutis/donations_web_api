"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn(
      "tb_users", // table name
      "type_user", // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'DEFAULT'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn("tb_users", "type_user");
  },
};
