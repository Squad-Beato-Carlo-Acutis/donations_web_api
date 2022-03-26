'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tb_user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'tb_users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tb_measure_id: {
        type: Sequelize.INTEGER,
        references: { model: 'tb_measures', key: 'id'},
        allowNull: true
      },
      tb_category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'tb_categories', key: 'id'},
        allowNull: false
      },
      ind_active: {
        type: Sequelize.TINYINT,
        defaultValue: true
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
    await queryInterface.dropTable('tb_products');
  }
};
