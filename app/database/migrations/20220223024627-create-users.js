'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('tab_userss', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pws: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name_user: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ind_active: {
        type: Sequelize.TINYINT,
        defaultValue: true
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
    await queryInterface.dropTable('tab_userss');
  }
};
