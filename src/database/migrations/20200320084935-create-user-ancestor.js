'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Usersancestors', {
	  id: {
		type: Sequelize.INTEGER,
	  },		
      UserUuid: {
        type: Sequelize.UUID,
      },
      ancestorUuid: {
        type: Sequelize.UUID,
      },
      createdAt: {
				allowNull: true,
				type: Sequelize.DATE,
				default: Sequelize.NOW,
			},
			updatedAt: {
				allowNull: true,
				type: Sequelize.DATE,
				default: Sequelize.NOW,
			}
		},{
			// freezeTableName: true,
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Usersancestors');
	}
};
