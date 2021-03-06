export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Wallets', {
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    user_uuid: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    balance: {
      type: Sequelize.INTEGER,
    },
    history: {
      type: Sequelize.ARRAY(Sequelize.JSON)
    },
    reference_id: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  // eslint-disable-next-line arrow-parens
  down: queryInterface => queryInterface.dropTable('Wallets'),
};
