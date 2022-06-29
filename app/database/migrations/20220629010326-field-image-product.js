"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn(
      "tb_products", // table name
      "link_image", // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn("tb_products", "link_image");
  },
};
