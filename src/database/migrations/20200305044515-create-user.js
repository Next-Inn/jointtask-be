'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('User', {
			uuid: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING
			},
			email: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING
			},
			phone: {
				allowNull: false,
				type: Sequelize.REAL
			},
			username: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING
			},
			address: {
				type: Sequelize.STRING
			},
			profile_pic: {
				type: Sequelize.STRING
			},
			// referee: {
			// 	type: Sequelize.Array(Sequelize.UUID),
			// },
			parentId: {
				type: Sequelize.UUID,
				hierarchy: true
			  },
			parentUuid: {
				type: Sequelize.UUID,
				hierarchy: true
			  },  
			hierarchyLevel: {
				type: Sequelize.INTEGER,
			},  
			verified: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			role: {
				type: Sequelize.ENUM,
				values: [
					'user',
					'admin'
				],
				defaultValue: 'user'
			},
			status: {
				type: Sequelize.ENUM,
				values: [
					'inactive',
					'active',
					'suspended'
				],
				defaultValue: 'inactive'
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		}, {
			freezeTableName: true,
			hierarchy: true
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('User');
	}
};
