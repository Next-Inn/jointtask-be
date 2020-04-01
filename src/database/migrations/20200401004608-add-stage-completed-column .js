module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'User',
    'stage_completed',
    {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'User',
    'stage_completed',
    {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  ),
};