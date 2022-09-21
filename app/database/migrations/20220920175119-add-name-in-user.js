'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      "tb_users", // table name
      "nickname", // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("tb_users", "nickname");
  }
};
