'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true
			},
			name: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				allowNull: {
					args: false,
					msg: 'Please enter your Email Address'
				},
				unique: {
					args: true,
					msg: 'Email Already Exist!!!'
				},
				validate: {
					isEmail: {
						args: true,
						msg: 'Please Enter A Valid Email Address'
					}
				}
			},
			phone: DataTypes.REAL,
			username: {
				type: DataTypes.STRING,
				allowNull: {
					args: false,
					msg: 'Please Enter Your Username'
				},
				unique: {
					args: true,
					msg: 'Username Already Exist'
				}
			},
			password: DataTypes.STRING,
			address: DataTypes.STRING,
			profile_pic: DataTypes.STRING,
			payed: DataTypes.BOOLEAN,
			stage_completed: DataTypes.INTEGER,
			// referee: {
			// 	type: DataTypes.ARRAY(DataTypes.UUID)
			// },
			// parentId: {
			// 	type: DataTypes.UUID,
			// 	hierarchy: true,
			// },
			parentUuid: {
				type: DataTypes.UUID,
			  },  
			verified: DataTypes.BOOLEAN,
			role: {
				type: DataTypes.ENUM('user', 'admin'),
				defaultValue: 'user'
			},
			status: {
				type: DataTypes.ENUM('inactive', 'active', 'suspended'),
				defaultValue: 'inactive'
			}
		},
		{
		freezeTableName: true,
		hierarchy: true
		}
	);
	User.associate = function (models){
		// associations can be defined here
		User.hasMany(models.Token, {
			foreignKey: 'user_uuid',
			as: 'tokens',
			onDelete: 'CASADE'
		});
	};
	return User;
};
