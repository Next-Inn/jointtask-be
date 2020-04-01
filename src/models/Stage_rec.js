export default (sequelize, DataTypes) => {
    const Stage_rec = sequelize.define('Stage_rec', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      referrer: DataTypes.UUID,
      referee: DataTypes.UUID
    },{
        freezeTableName: true,
    });
    // Stage_rec.associate = () => {
    //   // associations can be defined here
    // };
    return Stage_rec;
  };
