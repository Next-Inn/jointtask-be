'use strict';
module.exports = (sequelize, DataTypes) => {
	const UserAncestor = sequelize.define(
		'Usersancestors',
		{
            userId: {
                type: DataTypes.UUID,
              },
              ancestorId: {
                type: DataTypes.UUID,
              },
		},
		{
        //   freezeTableName: true,
        }
	);
	UserAncestor.associate = function (models){
		// associations can be defined here
	};
	return UserAncestor;
};
