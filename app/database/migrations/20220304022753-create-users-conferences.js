'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_users_conferences', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      tb_users_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tb_users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tb_conferences_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'tb_conferences', key: 'id' },
        onUpdate: 'CASCADE',
        onCreate: 'CASCADE'
      },
      create_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      update_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
