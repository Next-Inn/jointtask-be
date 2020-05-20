export default (sequelize, DataTypes) => {
    const PaymentRef = sequelize.define('PaymentRef', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_uuid: DataTypes.UUID,
      status: DataTypes.STRING,
      transaction: DataTypes.STRING,
      reference: DataTypes.STRING
    });
    // PaymentRef.associate = () => {
    //   // associations can be defined here
    // };
    return PaymentRef;
  };
  