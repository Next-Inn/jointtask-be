export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Stage_rec', {
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    referrer: {
      type: Sequelize.UUID,
    },
    referee: {
      type: Sequelize.UUID
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },{
    freezeTableName: true,
}),
  // eslint-disable-next-line arrow-parens
  down: queryInterface => queryInterface.dropTable('Stage_rec'),
};
