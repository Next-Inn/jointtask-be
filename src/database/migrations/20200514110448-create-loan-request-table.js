'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('LoanRequest', {
			uuid: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
			},
			user_uuid: {
				type: Sequelize.UUID
			},
			amount: {
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING
      		},
     	    bank: {
				type: Sequelize.STRING
      		},
      		accountName: {
				type: Sequelize.STRING
     		},
     	    accountNumber: {
				type: Sequelize.STRING
			},
			confirmed: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('LoanRequest');
	}
};
