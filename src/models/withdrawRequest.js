export default (sequelize, DataTypes) => {
    const WithdrawRequest = sequelize.define('WithdrawRequest', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    user_uuid: DataTypes.UUID,
    amount:DataTypes.STRING,
    email: DataTypes.STRING,
    bank: DataTypes.STRING,
    accountName: DataTypes.STRING,
    accountNumber:DataTypes.STRING,
    confirmed:DataTypes.BOOLEAN
    });
    // LoanRequest.associate = () => {
    //   // associations can be defined here
    // };
    return WithdrawRequest;
  };
  