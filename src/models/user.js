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
					args: false,
					msg: 'Username Already Exist'
				}
			},
			password: DataTypes.STRING,
			address: DataTypes.STRING,
			profile_pic: DataTypes.STRING,
			ref_uuid: DataTypes.UUID,
			referer_uuid: DataTypes.UUID
		},
		{}
	);
	User.associate = function (models){
		// associations can be defined here
		User.hasOne(models.Token, {
			foreignKey: 'user_uuid',
			as: 'token',
			onDelete: 'CASADE'
		});
	};
	return User;
};
