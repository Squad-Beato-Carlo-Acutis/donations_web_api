'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      "tb_conferences", // table name
      "map_iframe", // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("tb_conferences", "map_iframe");
  }
};
