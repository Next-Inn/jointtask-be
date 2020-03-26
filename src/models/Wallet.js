export default (sequelize, DataTypes) => {
    const Wallet = sequelize.define('Wallet', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_uuid: DataTypes.UUID,
      balance: DataTypes.INTEGER,
      history: DataTypes.ARRAY(DataTypes.JSON),
      reference_id: DataTypes.STRING
    });
    // Wallet.associate = () => {
    //   // associations can be defined here
    // };
    return Wallet;
  };
  