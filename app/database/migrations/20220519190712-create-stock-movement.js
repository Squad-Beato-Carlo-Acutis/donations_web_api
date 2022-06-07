'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_stock_movement', {
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
      tb_conference_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'tb_conferences', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      movement_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      movement_description: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('tb_stock_movement');
  }
};
