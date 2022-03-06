'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tb_conferences', {
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
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      link_avatar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      about: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      opening_hours: {
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
    await queryInterface.dropTable('tb_conferences');
  }
};
