'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_product_stock_movement', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tb_stock_movement_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'tb_stock_movement', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tb_product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'tb_products', key: 'id'},
      },
      movement_value: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      type_movement: {
        type: Sequelize.STRING(1),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_product_stock_movement');
  }
};
