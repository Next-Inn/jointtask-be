module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'User',
    'payed',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'User',
    'payed',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  ),
};