'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('tb_conferences', 'about', {
      type: DataTypes.STRING(1000),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('tb_conferences', 'about', {
      type: DataTypes.STRING,
      allowNull: false
    });
  }
};
