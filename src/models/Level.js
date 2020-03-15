export default (sequelize, DataTypes) => {
    const Level = sequelize.define('Level', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      value: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
    });
    // Level.associate = () => {
    //   // associations can be defined here
    // };
    return Level;
  };
  